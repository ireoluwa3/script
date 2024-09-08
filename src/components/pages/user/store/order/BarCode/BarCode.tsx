import { memo, useEffect, useState } from "react";
import { MashImage } from "@/components/elements/MashImage";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const BarCodeBase = ({ id, date }) => {
  const { t } = useTranslation();
  const [barcodeSrc, setBarcodeSrc] = useState("");
  useEffect(() => {
    if (id) {
      const fetchBarcode = async () => {
        const apiUrl = `https://barcode.tec-it.com/barcode.ashx?data=${id}&code=Code128&translate-esc=true`;
        setBarcodeSrc(apiUrl);
      };
      fetchBarcode();
    }
  }, [id]);
  return (
    <>
      <div className="mt-5 flex flex-row justify-between">
        <div className="relative">
          <MashImage
            className="dark:opacity-50 dark:invert"
            src={barcodeSrc}
            alt="barcode"
            width={400}
            height={150}
          />
        </div>
      </div>
      <span className="mt-4 block text-sm text-muted-400">
        {t("Issued on")} {formatDate(new Date(date || new Date()), "dd MMM yyyy")}
      </span>
    </>
  );
};
export const BarCode = memo(BarCodeBase);
