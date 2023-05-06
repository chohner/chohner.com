import { BibLatexParser, CSLExporter } from "biblatex-csl-converter";
import CSL from "citeproc";
import locale from "./locales-en-us.xml?raw"; // source: https://github.com/citation-style-language/locales/
import citationStyle from "./ieee-with-url.csl?raw"; // source: https://github.com/citation-style-language/styles/

export function bibtexToHTML(bibtexString: string) {
  const bibLatexParser = new BibLatexParser(bibtexString, {
    processUnexpected: true,
    processUnknown: true,
  });
  bibLatexParser.parse();
  const clsBibliography = new CSLExporter(bibLatexParser.bibDB).parse();

  const citeproc = new CSL.Engine(
    {
      retrieveLocale: () => locale,
      retrieveItem: (id: string) => clsBibliography[id],
    },
    citationStyle
  );
  citeproc.updateItems(Object.keys(clsBibliography));
  return citeproc.makeBibliography()[1];
}
