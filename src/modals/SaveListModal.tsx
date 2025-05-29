import { Delete, Download, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../contexts/DataContext";
import { useFormRef } from "../contexts/FormRefContext";
import { useStepper } from "../contexts/Stepper";

interface SaveListModalProps {
  open: boolean;
  formType: "threat" | "incident";
  onClose: () => void;
}

type SaveEntry = {
  label: string;
  type: "threat" | "incident";
  data: Record<string, any>;
};

export const SaveListModal: FC<SaveListModalProps> = ({
  open,
  onClose,
  formType,
}) => {
  const { t } = useTranslation();
  const formRef = useFormRef();
  const [saves, setSaves] = useState<Record<string, SaveEntry>>(loadSaves());
  const { setStep } = useStepper();
  const { setData } = useData();

  useEffect(() => {
    if (open) setSaves(loadSaves());
  }, [open]);

  function loadSaves() {
    return JSON.parse(localStorage.getItem("dora-saves") || "{}");
  }

  const handleDelete = (id: string) => {
    const newSaves = { ...saves };
    delete newSaves[id];
    localStorage.setItem("dora-saves", JSON.stringify(newSaves));
    setSaves(newSaves);
  };

  const handleDownload = (id: string) => {
    const blob = new Blob([JSON.stringify(saves[id], null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${id}.json`;
    link.click();
  };

  const handleEdit = (id: string) => {
    const entry = saves[id];
    if (entry.type !== formType) {
      alert(t("This backup corresponds to another form."));
      return;
    }
    if (formRef.current) {
      formRef.current.reset();
      setStep(0);
      setTimeout(() => setData(entry.data), 0);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth={true}>
      <DialogTitle>{t("My saves")}</DialogTitle>
      <DialogContent>
        <Table sx={{ width: "100%" }} size="small">
          <TableBody>
            {Object.entries(saves)
              .filter(([, meta]) => meta.type === formType)
              .map(([id, entry]) => (
                <TableRow key={id}>
                  <TableCell align="left">{entry.label}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDownload(id)}>
                      <Download />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("Cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};
