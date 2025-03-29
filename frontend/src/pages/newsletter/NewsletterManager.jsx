// import React, { useEffect, useState } from "react";
// import NewsletterForm from "./NewsletterManager";
// import axiosInstance from "../../api/api";
// import Table from "../../ui/table";
// import Modal from "../../ui/modal";
// import { FaEdit, FaRegTrashAlt, FaPaperPlane } from "react-icons/fa";
// import Pagination from "../../ui/pagination";
// import Search from "../../components/search";

// const columns = ["SUBJECT", "STATUS", "CREATED AT", "RECIPIENTS", "ACTION"];

// export default function NewsletterManager() {
//   const [newsletters, setNewsletters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [query, setQuery] = useState("");
//   const [totalPages, setTotalPages] = useState(1);

//   // Fetch newsletters with pagination and search
//   useEffect(() => {
//     const fetchNewsletters = async () => {
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get(`/newsletters`, {
//           params: { page, limit, q: query },
//         });
//         setNewsletters(res.data.newsletters);
//         setTotalPages(res.data.totalPages);
//         setLoading(false);
//       } catch (error) {
//         setError(error.response?.data?.message || "Error fetching newsletters");
//         setLoading(false);
//       }
//     };
//     fetchNewsletters();
//   }, [page, query, limit]);

//   const handleDelete = async () => {
//     if (confirmDelete) {
//       try {
//         await axiosInstance.delete(`/newsletters/${confirmDelete}`);
//         setNewsletters(newsletters.filter((n) => n._id !== confirmDelete));
//         setConfirmDelete(null);
//       } catch (error) {
//         console.error("Error deleting newsletter:", error);
//       }
//     }
//   };

//   const handleSend = async (id) => {
//     try {
//       await axiosInstance.post(`/newsletter/${id}/send`);
//       // Refresh the list after sending
//       const res = await axiosInstance.get(`/newsletters`, {
//         params: { page, limit, q: query },
//       });
//       setNewsletters(res.data.newsletters);
//     } catch (error) {
//       console.error("Error sending newsletter:", error);
//     }
//   };

//   const handleUpdate = async () => {
//     const res = await axiosInstance.get(`/newsletters`, {
//       params: { page, limit, q: query },
//     });
//     setNewsletters(res.data.newsletters);
//   };

//   const mappedNewsletters = newsletters.map((newsletter) => ({
//     SUBJECT: newsletter.subject,
//     STATUS: (
//       <span
//         className={`px-2 py-1 rounded-full text-xs ${
//           newsletter.status === "sent"
//             ? "bg-green-100 text-green-800"
//             : newsletter.status === "scheduled"
//             ? "bg-yellow-100 text-yellow-800"
//             : "bg-gray-100 text-gray-800"
//         }`}
//       >
//         {newsletter.status.toUpperCase()}
//       </span>
//     ),
//     "CREATED AT": new Date(newsletter.createdAt).toLocaleDateString(),
//     RECIPIENTS: newsletter.recipients?.length || 0,
//     ACTION: (
//       <div className="flex items-center gap-3 justify-center">
//         {newsletter.status === "draft" && (
//           <FaPaperPlane
//             onClick={() => handleSend(newsletter._id)}
//             className="cursor-pointer text-blue-500 hover:text-blue-700"
//             title="Send newsletter"
//           />
//         )}
//         <FaEdit
//           onClick={() => setSelectedId(newsletter._id)}
//           className="cursor-pointer text-ternary hover:text-primary"
//           title="Edit"
//         />
//         <FaRegTrashAlt
//           onClick={() => setConfirmDelete(newsletter._id)}
//           className="cursor-pointer text-red-500 hover:text-red-700"
//           title="Delete"
//         />
//       </div>
//     ),
//   }));

//   return (
//     <div className="w-full mt-20">
//       <div className="flex gap-2 items-center mb-4 justify-between">
//         <Search
//           setQuery={(e) => {
//             setQuery(e.target.value);
//             setPage(1); // Reset to first page on new search
//           }}
//         />
//         <button
//           onClick={() => setIsCreating(true)}
//           className="bg-ternary h-min text-white px-4 py-2 rounded"
//         >
//           Create Newsletter
//         </button>
//       </div>

//       <Table
//         error={error}
//         loading={loading}
//         data={mappedNewsletters}
//         columns={columns}
//       />

//       <Pagination
//         currentPage={page}
//         totalPages={totalPages}
//         onPageChange={setPage}
//       />

//       {/* Create/Edit Modal */}
//       <Modal
//         isOpen={isCreating || selectedId !== null}
//         onClose={() => {
//           setSelectedId(null);
//           setIsCreating(false);
//         }}
//       >
//         <NewsletterForm
//           mode={isCreating ? "create" : "edit"}
//           newsletterId={selectedId}
//           onClose={() => {
//             setSelectedId(null);
//             setIsCreating(false);
//           }}
//           onUpdate={handleUpdate}
//         />
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={confirmDelete !== null}
//         onClose={() => setConfirmDelete(null)}
//       >
//         <div className="p-8 dark:bg-darkCard rounded bg-white">
//           <p>Are you sure you want to delete this newsletter?</p>
//           <div className="flex justify-end space-x-4 mt-4">
//             <button
//               onClick={handleDelete}
//               className="bg-red-600 text-white px-4 py-2 rounded"
//             >
//               Yes, Delete
//             </button>
//             <button
//               onClick={() => setConfirmDelete(null)}
//               className="bg-gray-300 text-black px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
