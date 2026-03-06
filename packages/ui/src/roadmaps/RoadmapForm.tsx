"use client";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFullRoadmap } from "@repo/gql";
import { RootState, useSelector } from "@repo/reduxSetup";
import { useRouter } from "next/navigation";

export function RoadmapForm({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [authorId, setAuthorId] = useState(
    initialData?.authorId ?? "c3b67ca3-44a1-4f05-a511-980758b24176"
  );
  const router = useRouter();

  // Sync fields if initialData arrives after mount (SSR hydration edge case)
  useEffect(() => {
    if (!initialData) return;
    if (initialData.title) setTitle(initialData.title);
    if (initialData.description) setDescription(initialData.description);
    if (initialData.authorId) setAuthorId(initialData.authorId);
  }, [initialData]);

  const reduxNodes = useSelector((state: RootState) => state.roadmapSlice.nodes);
  const reduxEdges = useSelector((state: RootState) => state.roadmapSlice.edges);

  const mutation = useMutation({
    mutationFn: createFullRoadmap,
    onSuccess: () => router.push("/"),
    onError: (error) => {
      console.error(error);
      alert("Failed to create roadmap.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nodes = reduxNodes.map((node) => ({
      clientId: node.id,
      tutorialId: node.data.tutorial.id,
      positionX: node.position.x,
      positionY: node.position.y,
    }));
    const edges = reduxEdges.map((edge) => ({
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
    }));
    mutation.mutate({ title, description, authorId, nodes, edges });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl p-4 bg-surface-900 text-text-primary rounded-md shadow-md flex flex-col gap-4"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary w-full md:w-fit mt-2"
        >
          {mutation.isPending ? "Saving..." : initialData ? "Save Changes" : "Create Roadmap"}
        </button>
        {mutation.isError && (
          <p className="text-red-400 font-semibold mt-2 md:mt-0">
            Error saving roadmap
          </p>
        )}
      </div>
      <div className="flex flex-row gap-4 items-center">
        <input
          className="flex-1 p-2 border border-surface-800 rounded bg-surface-800 text-text-primary"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="flex-1 p-2 border border-surface-800 rounded bg-surface-800 text-text-primary"
          placeholder="Author ID"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />
      </div>
      <textarea
        className="p-2 border border-surface-800 rounded bg-surface-800 text-text-primary h-20"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </form>
  );
}

// "use client";
// import React, { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { createFullRoadmap } from "@repo/gql";
// import { RootState, useSelector } from "@repo/reduxSetup";
// import { useRouter } from "next/navigation";
//
// export function RoadmapForm() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [authorId, setAuthorId] = useState("c3b67ca3-44a1-4f05-a511-980758b24176");
//
//   const router = useRouter()
//
//   // 👇 Get nodes & edges from Redux
//   const reduxNodes = useSelector((state: RootState) => state.roadmapSlice.nodes);
//   const reduxEdges = useSelector((state: RootState) => state.roadmapSlice.edges);
//
//   const mutation = useMutation({
//     mutationFn: createFullRoadmap,
//     onSuccess: (data) => {
//       router.push('/')
//     },
//     onError: (error) => {
//       console.error(error);
//       alert("Failed to create roadmap.");
//     },
//   });
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//
//     // 👇 Map Redux nodes to API format
//     const nodes = reduxNodes.map((node) => ({
//       clientId: node.id,           // e.g. "t1", "t2" — used to link edges
//       tutorialId: node.data.tutorial.id,
//       positionX: node.position.x,
//       positionY: node.position.y,
//     }));
//
//     // 👇 Map Redux edges to API format
//     const edges = reduxEdges.map((edge) => ({
//       sourceNodeId: edge.source,   // matches node.id = clientId
//       targetNodeId: edge.target,
//     }));
//
//     mutation.mutate({ title, description, authorId, nodes, edges });
//   };
//
//   return (
//     <form onSubmit={handleSubmit} className="w-full max-w-5xl p-4 bg-surface-900 text-text-primary rounded-md shadow-md flex flex-col gap-4">
//       <div className="flex flex-col md:flex-row gap-4 items-center">
//         <button
//           type="submit"
//           disabled={mutation.isPending}
//           className="btn-primary w-full md:w-fit mt-2"
//         >
//           {mutation.isPending ? "Creating..." : "Create Roadmap"}
//         </button>
//         {mutation.isError && (
//           <p className="text-red-400 font-semibold mt-2 md:mt-0">
//             Error creating roadmap
//           </p>
//         )}
//       </div>
//       <div className="flex flex-row gap-4 items-center">
//         <input
//           className="flex-1 p-2 border border-surface-800 rounded bg-surface-800 text-text-primary"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <input
//           className="flex-1 p-2 border border-surface-800 rounded bg-surface-800 text-text-primary"
//           placeholder="Author ID"
//           value={authorId}
//           onChange={(e) => setAuthorId(e.target.value)}
//         />
//       </div>
//       <textarea
//         className="p-2 border border-surface-800 rounded bg-surface-800 text-text-primary h-20"
//         placeholder="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />
//     </form>
//   );
// };
