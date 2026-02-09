// app/admin/components/InboxList.tsx
"use client";

import { useState } from "react";
import { useInbox } from "@/app/hooks/useInbox";
import { Clock, User, Home, MessageSquare, CheckCircle, XCircle, Eye } from "lucide-react";
import type { InboxItem } from "@/app/types/inbox";

interface InboxListProps {
  type?: "user_verification" | "property_verification" | "feedback";
  status?: "unread" | "approve" | "deny";
  title?: string;
  description?: string;
}

export default function InboxList({ type, status, title, description }: InboxListProps) {
  const { items, loading, error, total, reviewItem, refresh } = useInbox({
    type,
    status: status || "unread", // 默认只显示未处理的
    autoRefresh: true,
    refreshInterval: 30000, // 30秒自动刷新
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reviewNote, setReviewNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<"approve" | "deny" | null>(null);
  const [currentInboxId, setCurrentInboxId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);

  // 获取类型图标
  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case "user_verification":
        return <User className="h-4 w-4" />;
      case "property_verification":
        return <Home className="h-4 w-4" />;
      case "feedback":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // 获取状态徽章
  const getStatusBadge = (itemStatus: string) => {
    switch (itemStatus) {
      case "unread":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "approve":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case "deny":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            Denied
          </span>
        );
      default:
        return null;
    }
  };

  // 处理审核
  const handleReview = async (inboxId: string, action: "approve" | "deny") => {
    setCurrentInboxId(inboxId);
    setCurrentAction(action);
    setShowNoteModal(true);
  };

  // 确认审核
  const confirmReview = async () => {
    if (!currentInboxId || !currentAction) return;

    try {
      await reviewItem(currentInboxId, currentAction, reviewNote);
      setShowNoteModal(false);
      setReviewNote("");
      setCurrentInboxId(null);
      setCurrentAction(null);
    } catch (err) {
      console.error("Review failed:", err);
      alert("Failed to review item. Please try again.");
    }
  };

  // 查看详情
  const handleViewDetails = (item: InboxItem) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-primary))]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
        <p className="text-sm text-red-800 dark:text-red-400">Error: {error}</p>
        <button
          onClick={() => refresh()}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline dark:text-red-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">{title || "Inbox Items"}</h3>
          {description && (
            <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[rgb(var(--color-muted))]">
            {total} {total === 1 ? "item" : "items"}
          </span>
          <button
            onClick={() => refresh()}
            className="text-sm text-[rgb(var(--color-primary))] hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* 列表 */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-[rgb(var(--color-muted))]">
            No items to review at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                {/* 左侧信息 */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTypeIcon(item.type)}
                    <span className="font-medium text-sm capitalize">
                      {item.type.replace(/_/g, " ")}
                    </span>
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-[rgb(var(--color-muted))]">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <div className="text-sm text-[rgb(var(--color-muted))] space-y-1">
                    {item.user_name && (
                      <p className="truncate">
                        <span className="font-medium">User:</span> {item.user_name}
                      </p>
                    )}
                    {item.user_email && (
                      <p className="truncate">
                        <span className="font-medium">Email:</span> {item.user_email}
                      </p>
                    )}
                  </div>

                  {item.review_note && (
                    <div className="mt-2 rounded bg-[rgb(var(--color-muted))]/10 p-2">
                      <p className="text-xs text-[rgb(var(--color-muted))]">
                        <span className="font-medium">Note:</span> {item.review_note}
                      </p>
                    </div>
                  )}
                </div>

                {/* 右侧操作按钮 */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {item.status === "unread" && (
                    <>
                      <button
                        onClick={() => handleReview(item.id, "approve")}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(item.id, "deny")}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors whitespace-nowrap"
                      >
                        Deny
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="px-3 py-1.5 text-xs font-medium border border-[rgb(var(--color-border))] rounded hover:bg-[rgb(var(--color-muted))]/10 transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 审核备注模态框 */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {currentAction === "approve" ? "Approve" : "Deny"} Item
            </h3>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={confirmReview}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary))] rounded hover:opacity-90 transition-opacity"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setReviewNote("");
                  setCurrentInboxId(null);
                  setCurrentAction(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium border border-[rgb(var(--color-border))] rounded hover:bg-[rgb(var(--color-muted))]/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[rgb(var(--color-background))] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Item Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Type</p>
                <p className="text-sm capitalize">{selectedItem.type.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Status</p>
                <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Reference ID</p>
                <p className="text-sm font-mono">{selectedItem.reference_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Created</p>
                <p className="text-sm">{new Date(selectedItem.created_at).toLocaleString()}</p>
              </div>
              {selectedItem.reviewed_at && (
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Reviewed</p>
                  <p className="text-sm">{new Date(selectedItem.reviewed_at).toLocaleString()}</p>
                </div>
              )}
              {selectedItem.review_note && (
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--color-muted))]">Review Note</p>
                  <p className="text-sm">{selectedItem.review_note}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="mt-6 w-full px-4 py-2 text-sm font-medium border border-[rgb(var(--color-border))] rounded hover:bg-[rgb(var(--color-muted))]/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}