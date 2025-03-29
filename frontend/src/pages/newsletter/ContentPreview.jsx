// components/ContentPreview.jsx
import { useState } from "react";
import Modal from "../../ui/modal";

export default function ContentPreview({ content, maxLength = 100 }) {
  const [isOpen, setIsOpen] = useState(false);

  const truncatedContent =
    content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;

  return (
    <>
      <div className="max-h-20 overflow-y-auto">
        {truncatedContent}
        {content.length > maxLength && (
          <button
            onClick={() => setIsOpen(true)}
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            See More
          </button>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6 dark:bg-darkCard rounded bg-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Full Content</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            ></button>
          </div>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Modal>
    </>
  );
}
