import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';
import { useData } from "../contexts/DataContext";

interface SaveModalProps {
  open: boolean;
  formType: "threat" | "incident";
  onClose: () => void;
}

type SaveEntry = {
  label: string;
  type: "threat" | "incident";
  data: Record<string, any>;
};

const SaveModal: FC<SaveModalProps> = ({ open, formType, onClose }) => {
  const { t } = useTranslation();
  const { data } = useData();
  const [label, setLabel] = useState<string>(
    `${formType}-${new Date().toLocaleString()}`
  );

  useEffect(() => {
    if (open) setLabel(`${formType}-${new Date().toLocaleString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function loadSaves() {
    return JSON.parse(localStorage.getItem("dora-saves") || "{}");
  }

  const handleSave = (label: string) => {
    const id = uuidv4();
    const entry: SaveEntry = { label, type: formType, data: data };
    const newSaves = { ...loadSaves(), [id]: entry };
    localStorage.setItem("dora-saves", JSON.stringify(newSaves));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth={true}>
      <DialogTitle>{t("Save naming")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t("Label")}
          type="text"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Cancel")}</Button>
        <Button onClick={() => handleSave(label)}>{t("Save")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveModal;
