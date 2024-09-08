import { useEffect } from "react";
import { memo } from "react";
import ToggleBox from "@/components/elements/base/toggle-box/ToggleBox";
import { useKnowledgeBaseStore } from "@/stores/knowledgeBase";
import Card from "@/components/elements/base/card/Card";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
type FaqProps = {
  category: string;
};
const FaqBase = ({ category }: FaqProps) => {
  const { t } = useTranslation();
  const { faqs, setCategory } = useKnowledgeBaseStore();
  const debouncedSetCategory = debounce(setCategory, 100);

  useEffect(() => {
    debouncedSetCategory(category);
  }, [category, setCategory]);

  return faqs.length > 0 ? (
    <Card className="mt-10 grid grid-cols-2 gap-4 p-5" color={"muted"}>
      <div className="col-span-2">
        <h1 className="text-xl text-primary-500 dark:text-primary-400">
          {t("Frequently Asked Questions")}
        </h1>
      </div>
      {faqs.map((faq) => (
        <div key={faq.id} className="col-span-2 md:col-span-1">
          <ToggleBox title={faq.question} color="contrast">
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400">
              {faq.answer}
            </p>
          </ToggleBox>
        </div>
      ))}
    </Card>
  ) : null;
};
export const Faq = memo(FaqBase);
