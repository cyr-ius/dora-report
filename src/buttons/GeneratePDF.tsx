import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useRef, type FC, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useErrors } from "../contexts/ErrorContext";

interface PDFButtonProps {
  data: any;
  formRef: RefObject<any>;
}

export const GeneratePDGButton: FC<PDFButtonProps> = ({ data, formRef }) => {
  const { t } = useTranslation();
  const { errors } = useErrors();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    formRef.current.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Définir la couleur bleu pour la page de garde
    // const blueColor = [41, 87, 160]; // RGB pour le bleu (ajuste si nécessaire)
    // Covea rgba(18,33,71,255)
    const blueColor: [number, number, number] = [18, 33, 71];
    // Page de garde avec fond bleu
    doc.setFillColor(blueColor[0], blueColor[1], blueColor[2]); // Définir la couleur de fond
    doc.rect(
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
      "F"
    ); // Remplir toute la page avec la couleur

    // Calculer la position horizontale pour centrer le texte
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const title = t("DORA Major Incident Report");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); // Texte blanc pour contraster avec le bleu
    const titleWidth = doc.getTextWidth(title); // Largeur du texte
    const titleX = (pageWidth - titleWidth) / 2; // Position horizontale pour centrer le texte
    const titleY = pageHeight / 3; // Position verticale (1/3 de la hauteur de la page)

    // Page de garde avec titre centré
    doc.text(title, titleX, titleY); // Titre centré

    // Date centrée
    const dateText = `${t("Date")} : ${new Date().toLocaleString()}`;
    doc.setFontSize(14);
    const dateWidth = doc.getTextWidth(dateText); // Largeur du texte de la date
    const dateX = (pageWidth - dateWidth) / 2; // Position horizontale pour centrer la date
    const dateY = titleY + 20; // Position verticale sous le titre

    doc.text(dateText, dateX, dateY); // Date centrée

    // Description centrée
    const description = t("This document contains the form data.");
    doc.setFontSize(12);
    const descriptionWidth = doc.getTextWidth(description);
    const descriptionX = (pageWidth - descriptionWidth) / 2;
    const descriptionY = (pageHeight * 96) / 100; // Position verticale sous la date

    doc.text(description, descriptionX, descriptionY); // Description centrée

    // Nouvelle page pour les données
    doc.addPage();

    // Entête du tableau avec le même bleu
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Texte noir pour le tableau
    doc.text("Summary of the submitted form", 14, 20);

    const tableData: any[] = [];

    const flatten = (obj: any, prefix = "") => {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const newPrefix = `${prefix}[${index}]`;
          if (typeof item === "object" && item !== null) {
            flatten(item, newPrefix);
          } else {
            tableData.push([newPrefix, String(item)]);
          }
        });
      } else if (obj !== null && typeof obj === "object") {
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          flatten(value, fullKey);
        });
      } else {
        tableData.push([prefix, String(obj)]);
      }
    };

    flatten(data);

    // Entête du tableau avec fond bleu
    autoTable(doc, {
      head: [[t("Field"), t("Value")]],
      body: tableData,
      startY: 30,
      headStyles: {
        fillColor: blueColor, // Fond bleu pour l'entête du tableau
        textColor: [255, 255, 255], // Texte blanc
      },
    });

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const fileName = `formulaire_${timestamp}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button
      ref={buttonRef}
      variant="contained"
      color="primary"
      onClick={generatePDF}
      sx={{
        backgroundColor: "purple",
        color: "white",
        "&:hover": { backgroundColor: "#5e0e9b" },
      }}
      disabled={errors.length > 0}
    >
      {t("Generate")} PDF
    </Button>
  );
};
