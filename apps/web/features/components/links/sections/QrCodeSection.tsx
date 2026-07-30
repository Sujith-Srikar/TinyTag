"use client";

import { LinkBuilderFields } from "@repo/shared";
import QrCode from "qrcode";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { APP_URL } from "@repo/shared";
import styles from '../LinkBuilder.module.scss'

export const QrCodeSection = () => {

  const [svg, setSvg] = useState<string>("");
  const {watch} = useFormContext<LinkBuilderFields>();
  const slug = watch('slug');

  useEffect(() => {
    if(!slug) return;
    let cancelled = false;

    const generateQR = async () => {
      try {
        const url = await QrCode.toString(`${APP_URL}/${slug}`, {
          errorCorrectionLevel: "H",
          width: 156,
          margin: 2,
        });
        if (!cancelled) setSvg(url);
      } catch {
        // QR generation is non-critical
      }
    };

    generateQR();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className={styles.qrCard}>
      <div className={styles.qrHeader}>
        <span>QR Code</span>
      </div>

      <div className={styles.qrPreview}>
        <div
          className={styles.qrSvg}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
};
