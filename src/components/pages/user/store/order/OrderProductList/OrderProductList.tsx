import { memo } from "react";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import { MashImage } from "@/components/elements/MashImage";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import { Icon } from "@iconify/react";
import Link from "next/link";

const OrderProductListBase = ({ products }) => {
  return products.map((product, index) => (
    <li key={index}>
      <ListWidgetItem
        href="#"
        avatarSize="xxs"
        avatar={
          <MashImage
            src={product.image || "/img/placeholder.svg"}
            alt="Nitro Inc."
            width={32}
            height={32}
            className="rounded-lg"
          />
        }
        title={product.name}
        text={`${product.price} ${product.currency}`}
        itemAction={
          <div className="flex items-center gap-2">
            {product.type === "DOWNLOADABLE" && (
              <AnimatedTooltip
                content={
                  product.ecommerceOrderItem?.key
                    ? "Download key"
                    : product.ecommerceOrderItem?.filePath
                    ? "Download file"
                    : "Not available yet"
                }
              >
                <Icon
                  icon="line-md:downloading-loop"
                  className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500"
                  onClick={() => {
                    if (product.ecommerceOrderItem?.key) {
                      const element = document.createElement("a");
                      const file = new Blob(
                        [
                          `Product Activation Key\n\n` +
                            `Dear Customer,\n\n` +
                            `Thank you for your purchase. Please find your product activation key below:\n\n` +
                            `Key: ${product.ecommerceOrderItem.key}\n\n` +
                            `To activate your product, enter the key in the designated field during the installation or setup process. If you encounter any issues or have questions, please do not hesitate to contact our support team.\n\n` +
                            `Best regards,\n` +
                            `${process.env.NEXT_PUBLIC_SITE_NAME} Support Team\n` +
                            `${process.env.NEXT_PUBLIC_APP_EMAIL}`,
                        ],
                        { type: "text/plain" }
                      );

                      element.href = URL.createObjectURL(file);
                      element.download = `${product.name}-key.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    } else if (product.ecommerceOrderItem?.filePath) {
                      const element = document.createElement("a");
                      element.href = product.ecommerceOrderItem.filePath;
                      element.download = `${product.name}`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }
                  }}
                />
              </AnimatedTooltip>
            )}

            <Link
              href={`/store/${product.category?.name}/${product.name}`}
              className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500"
            >
              <Icon icon="lucide:arrow-right" />
            </Link>
          </div>
        }
      />
    </li>
  ));
};

export const OrderProductList = memo(OrderProductListBase);
