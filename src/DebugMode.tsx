import { Box } from "@mui/material";
import { useMemo, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "./contexts/DataContext";
import { useErrors } from "./contexts/ErrorContext";

export const DebugMode: FC = () => {
  const { i18n } = useTranslation();
  const { data } = useData();
  const { errors } = useErrors();
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <Box className="App-debug-pre">
      <small>
        Locale: {i18n.language.toUpperCase()}
        <br />
        Current Errors:
        <br />
        <br />
        Export JSON:
        <pre id="boundData">{stringifiedData}</pre>
        Errors:
        {JSON.stringify(errors)}
        <br />
      </small>
    </Box>
  );
};
