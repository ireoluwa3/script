import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import $fetch from "@/utils/api";
import { FormEvent, useEffect } from "react";

export const googleClientId = process.env
  .NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

const recaptchaEnabled =
  process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_STATUS === "true" || false;
const recaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";

type LoginStore = {
  loading: boolean;
  email: string;
  password: string;
  isVerificationStep: boolean;
  verificationCode: string;
  is2FAVerificationStep: boolean;
  otp: string;
  userId: string;
  twoFactorType: string;
  resendCooldown: number;
  resendAttempts: number;
  recaptchaRef: any | null;
  cooldownInterval: NodeJS.Timeout | null;
  script: HTMLScriptElement | null;
  errors: {
    email: string | undefined;
    password: string | undefined;
  };
  setErrors: (errors: {
    email: string | undefined;
    password: string | undefined;
  }) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setVerificationCode: (code: string) => void;
  setOtp: (otp: string) => void;
  setLoading: (loading: boolean) => void;
  handleSubmit: (router: any) => Promise<void>;
  handleVerificationSubmit: (router: any) => Promise<void>;
  handle2FASubmit: (router: any) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  initializeRecaptcha: () => void;
  decrementCooldown: () => void;
};

export const useLoginStore = create<LoginStore>()(
  immer((set, get) => {
    const decrementCooldown = () => {
      const interval = setInterval(() => {
        set((state) => {
          if (state.resendCooldown > 0) {
            state.resendCooldown -= 1;
          } else {
            clearInterval(interval);
          }
        });
      }, 1000);
    };

    return {
      recaptchaRef: null,
      cooldownInterval: null,
      loading: false,
      email: "",
      password: "",
      isVerificationStep: false,
      verificationCode: "",
      is2FAVerificationStep: false,
      otp: "",
      userId: "",
      twoFactorType: "",
      resendCooldown: 0,
      resendAttempts: 0,
      script: null,
      errors: {
        email: undefined,
        password: undefined,
      },

      setErrors: (errors) =>
        set((state) => {
          state.errors = errors;
        }),

      setEmail: (email) =>
        set((state) => {
          state.email = email;
        }),
      setPassword: (password) =>
        set((state) => {
          state.password = password;
        }),
      setVerificationCode: (code) =>
        set((state) => {
          state.verificationCode = code;
        }),
      setOtp: (otp) =>
        set((state) => {
          state.otp = otp;
        }),
      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),
      initializeRecaptcha: () => {
        if (typeof window !== "undefined" && recaptchaEnabled) {
          const { recaptchaRef } = get();
          const script = document.createElement("script");
          script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
          script.onload = () => {
            const { grecaptcha } = window as any;
            if (grecaptcha) {
              grecaptcha.ready(() => {
                if (recaptchaRef) {
                  set((state) => {
                    state.recaptchaRef = grecaptcha.render(
                      "recaptcha-container",
                      {
                        sitekey: recaptchaSiteKey,
                        size: "invisible",
                      }
                    );
                  });
                }
              });
            }
          };
        }
      },
      decrementCooldown,

      handleSubmit: async (router) => {
        set((state) => {
          state.loading = true;
        });
        let recaptchaToken = null;
        if (recaptchaEnabled) {
          const { grecaptcha } = window as any;
          if (grecaptcha && typeof grecaptcha.execute === "function") {
            try {
              recaptchaToken = await grecaptcha.execute(recaptchaSiteKey, {
                action: "login",
              });
            } catch (error) {
              toast.error("Recaptcha execution failed. Please try again.");
              set((state) => {
                state.loading = false;
              });
              return;
            }
          } else {
            toast.error("Recaptcha failed to load. Please refresh the page.");
            set((state) => {
              state.loading = false;
            });
            return;
          }
        }

        const { data, error, validationErrors } = await $fetch({
          url: "/api/auth/login",
          method: "POST",
          body: {
            email: get().email,
            password: get().password,
            recaptchaToken,
          },
        });

        set((state) => {
          state.loading = false;
        });

        if (validationErrors) {
          if (validationErrors.email === 'Email must match format "email".') {
            validationErrors.email = "Invalid email format";
          }
          set((state) => {
            state.errors = validationErrors as any;
          });
          return;
        }

        if (error) {
          set((state) => {
            state.errors = {
              email: "Invalid email or password",
              password: "Invalid email or password",
            };
          });
          return;
        }

        if (
          data.message &&
          data.message.startsWith("User email not verified")
        ) {
          set((state) => {
            state.isVerificationStep = true;
          });
        } else if (data.message && data.message.includes("2FA required")) {
          set((state) => {
            state.is2FAVerificationStep = true;
            state.userId = data.id;
            state.twoFactorType = data.twoFactor.type;
          });
        } else {
          // Reset isFetched before redirecting
          useDashboardStore.getState().setIsFetched(false);

          // Trigger profile fetch after successful login
          await useDashboardStore.getState().fetchProfile();
          router.push(defaultUserPath);
        }
      },

      handleVerificationSubmit: async (router) => {
        set((state) => {
          state.loading = true;
        });

        const { verificationCode } = get();
        const { error } = await $fetch({
          url: "/api/auth/verify/email",
          method: "POST",
          body: { token: verificationCode },
        });

        if (!error) {
          useDashboardStore.getState().setIsFetched(false);

          // remove token from query and push to /user
          const { pathname, query } = router;
          delete query.token;
          router.push({ pathname, query });
        }

        set((state) => {
          state.loading = false;
        });
      },
      handle2FASubmit: async (router) => {
        set((state) => {
          state.loading = true;
        });
        const { data, error } = await $fetch({
          url: "/api/auth/otp/login",
          method: "POST",
          body: { id: get().userId, otp: get().otp },
        });
        if (data && !error) {
          useDashboardStore.getState().setIsFetched(false);
          router.push(defaultUserPath);
        }
        set((state) => {
          state.loading = false;
        });
      },
      handleResendOtp: async () => {
        if (get().resendCooldown > 0 || get().resendAttempts >= 5) {
          toast.error("Please wait before resending the OTP.");
          return;
        }
        set((state) => {
          state.loading = true;
        });
        const { data, error } = await $fetch({
          url: "/api/auth/otp/resend",
          method: "POST",
          body: { id: get().userId, type: get().twoFactorType },
        });
        set((state) => {
          state.loading = false;
        });
        if (data && !error) {
          set((state) => {
            state.resendAttempts += 1;
            state.resendCooldown = 60;
          });
          get().decrementCooldown();
        }
      },
    };
  })
);
