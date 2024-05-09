import { useState } from "react";
import TranslatedBox from "./TranslatedBox";
import SourceBox from "./SourceBox";

export default function BoxWrapper() {
  /* States */
  const [translated, setTranslated] = useState(true);

  /* Methods */
  const flipTranslSrc = () => {
    setTranslated((_prev) => !_prev);
  };

  if (translated) return <TranslatedBox flipTranslSrc={flipTranslSrc} />;

  return <SourceBox flipTranslSrc={flipTranslSrc} />;
}
