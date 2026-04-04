import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown-light.css"; // 引入 GitHub 风格样式
import markdownText from "./index.md?raw";

const Resume = () => {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};

export default Resume;
