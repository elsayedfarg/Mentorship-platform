import { useState, useEffect } from "react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Mock store hook — replace with your real useAdminStore binding
// ---------------------------------------------------------------------------
// Expected store shape:
//   stacks        : Array<{ _id, name, description, mentor_count }>
//   stacksLoading : boolean
//   createStack   : (payload) => Promise<{ success, error? }>
//   updateStack   : (id, payload) => Promise<{ success, error? }>
//   deleteStack   : (id) => Promise<{ success, error? }>
// ---------------------------------------------------------------------------
import useAdminStore from "@/store/adminStore";
import { getId } from "@/lib/format";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const EMPTY_FORM = { name: "", description: "" };

function StackFormModal({ initial = EMPTY_FORM, onSave, onClose, saving }) {
    const [form, setForm] = useState(initial);
    const isEdit = Boolean(initial._id);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Stack name is required.");
            return;
        }
        onSave({ name: form.name.trim(), description: form.description.trim() });
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Panel */}
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--brand-brown)]">
                        {isEdit ? "Edit Stack" : "New Stack"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted-foreground hover:text-[var(--brand-brown)] transition-colors"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="stack-name"
                            className="text-xs font-semibold text-[var(--brand-brown)] uppercase tracking-wide"
                        >
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="stack-name"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. React, Node.js, Data Science"
                            className="border border-[var(--brand-outline)] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-brown-light)]/40 transition"
                            disabled={saving}
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="stack-desc"
                            className="text-xs font-semibold text-[var(--brand-brown)] uppercase tracking-wide"
                        >
                            Description
                        </label>
                        <textarea
                            id="stack-desc"
                            rows={3}
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value }))
                            }
                            placeholder="Short description of this technical stack…"
                            className="border border-[var(--brand-outline)] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-brown-light)]/40 transition resize-none"
                            disabled={saving}
                        />
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 border border-[var(--brand-outline)] rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:text-[var(--brand-brown)] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[var(--brand-brown-light)] text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Stack"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteConfirmModal({ stack, onConfirm, onClose, deleting }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-[var(--brand-brown)]">
                        Delete Stack
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Delete{" "}
                        <span className="font-semibold text-gray-800">"{stack.name}"</span>
                        ? This cannot be undone.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="flex-1 border border-[var(--brand-outline)] rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:text-[var(--brand-brown)] transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {deleting ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const AdminStacks = () => {
    const { stacks, stacksLoading, fetchStacks, fetchStackStats, createStack, updateStack, deleteStack } = useAdminStore();
    useEffect(() => {
        fetchStacks();
    }, []);

    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // stack object
    const [deleteTarget, setDeleteTarget] = useState(null); // stack object
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = stacks.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Create ────────────────────────────────────────────────────────────────
    const handleCreate = async (payload) => {
        setSaving(true);
        const result = await createStack(payload);
        setSaving(false);
        if (result.success) {
            toast.success("Stack created.");
            setShowCreate(false);
        } else {
            toast.error(result.error || "Failed to create stack.");
        }
    };

    // ── Update ────────────────────────────────────────────────────────────────
    const handleUpdate = async (payload) => {
        setSaving(true);
        const result = await updateStack(getId(editTarget), payload);
        setSaving(false);
        if (result.success) {
            toast.success("Stack updated.");
            setEditTarget(null);
        } else {
            toast.error(result.error || "Failed to update stack.");
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        setDeleting(true);
        const result = await deleteStack(getId(deleteTarget));
        setDeleting(false);
        if (result.success) {
            toast.success("Stack deleted.");
            setDeleteTarget(null);
        } else {
            toast.error(result.error || "Failed to delete stack.");
        }
    };

    return (
        <>
            <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6 pb-12">
                {/* Header */}
                <div className="flex items-start justify-between mt-2 gap-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-bold text-[var(--brand-brown)] tracking-tight">
                            Technical Stacks
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Create and manage the stacks mentors can be associated with.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 bg-[var(--brand-brown-light)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-base leading-none">
                            add
                        </span>
                        New Stack
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none">
                        search
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search stacks…"
                        className="w-full border border-[var(--brand-outline)] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-brown-light)]/40 transition"
                    />
                </div>

                {/* Content */}
                {stacksLoading ? (
                    <p className="text-sm text-muted-foreground text-center py-12">
                        Loading stacks…
                    </p>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 border border-dashed border-[var(--brand-outline)] rounded-xl text-center">
                        <span className="material-symbols-outlined text-4xl text-muted-foreground">
                            stacked_bar_chart
                        </span>
                        <p className="text-sm text-muted-foreground">
                            {search ? "No stacks match your search." : "No stacks yet."}
                        </p>
                        {!search && (
                            <button
                                type="button"
                                onClick={() => setShowCreate(true)}
                                className="text-sm font-semibold text-[var(--brand-brown-light)] hover:underline"
                            >
                                Create the first stack
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white border border-[var(--brand-outline)] rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--brand-surface-muted)] border-b border-[var(--brand-outline)]">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--brand-brown)]">
                                        Name
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--brand-brown)] hidden sm:table-cell">
                                        Description
                                    </th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--brand-brown)]">
                                        Mentors
                                    </th>
                                    <th className="text-right px-4 py-3 font-semibold text-[var(--brand-brown)]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((stack) => (
                                    <tr
                                        key={getId(stack)}
                                        className="border-b border-[var(--brand-outline)] last:border-0 hover:bg-[var(--brand-surface-muted)]/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {stack.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell max-w-xs truncate">
                                            {stack.description || (
                                                <span className="italic opacity-50">No description</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]">
                                                {stack.mentorCount}
                                                {console.log(stack)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditTarget(stack)}
                                                    className="text-xs font-semibold text-[var(--brand-brown-light)] hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(stack)}
                                                    className="text-xs font-semibold text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="px-4 py-2 border-t border-[var(--brand-outline)] bg-[var(--brand-surface-muted)] text-xs text-muted-foreground">
                            {filtered.length} stack{filtered.length !== 1 ? "s" : ""}
                            {search && ` matching "${search}"`}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreate && (
                <StackFormModal
                    onSave={handleCreate}
                    onClose={() => setShowCreate(false)}
                    saving={saving}
                />
            )}

            {editTarget && (
                <StackFormModal
                    initial={editTarget}
                    onSave={handleUpdate}
                    onClose={() => setEditTarget(null)}
                    saving={saving}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    stack={deleteTarget}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                    deleting={deleting}
                />
            )}
        </>
    );
};

export default AdminStacks;