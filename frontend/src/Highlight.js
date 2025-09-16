import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

const Highlight = ({ language, value, isDarkMode }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={isDarkMode ? oneDark : prism}
      showLineNumbers
    >
      {value}
    </SyntaxHighlighter>
  );
};

export default Highlight;
