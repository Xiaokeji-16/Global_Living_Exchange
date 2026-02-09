// app/hooks/useInbox.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  InboxItem,
  InboxListResponse,
  InboxStats,
} from "@/app/types/inbox";

interface UseInboxOptions {
  type?: string;
  status?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // 毫秒
}

export function useInbox(options: UseInboxOptions = {}) {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { type, status, autoRefresh = false, refreshInterval = 30000 } = options;

  // 获取 Inbox 列表
  const fetchInbox = useCallback(
    async (currentPage = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: "20",
        });

        if (type) params.append("type", type);
        if (status) params.append("status", status);

        const response = await fetch(`/api/admin/inbox?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch inbox items");
        }

        const data: InboxListResponse = await response.json();

        setItems(data.items);
        setTotal(data.total);
        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [type, status]
  );

  // 审核操作
  const reviewItem = async (
    inboxId: string,
    action: "approve" | "deny",
    note?: string
  ) => {
    try {
      const response = await fetch(`/api/admin/inbox/${inboxId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });

      if (!response.ok) {
        throw new Error("Failed to review item");
      }

      const result = await response.json();

      // 刷新列表
      await fetchInbox(page);

      return result;
    } catch (err) {
      throw err;
    }
  };

  // 批量审核
  const bulkReview = async (
    inboxIds: string[],
    action: "approve" | "deny",
    note?: string
  ) => {
    try {
      const response = await fetch("/api/admin/inbox/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxIds, action, note }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk review items");
      }

      const result = await response.json();

      // 刷新列表
      await fetchInbox(page);

      return result;
    } catch (err) {
      throw err;
    }
  };

  // 获取单个项目详情
  const getItemDetails = async (inboxId: string) => {
    try {
      const response = await fetch(`/api/admin/inbox/${inboxId}/review`);

      if (!response.ok) {
        throw new Error("Failed to fetch item details");
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  // 初始加载
  useEffect(() => {
    fetchInbox(1);
  }, [fetchInbox]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchInbox(page);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchInbox, page]);

  return {
    items,
    loading,
    error,
    total,
    page,
    hasMore,
    refresh: () => fetchInbox(page),
    loadMore: () => fetchInbox(page + 1),
    reviewItem,
    bulkReview,
    getItemDetails,
  };
}

// 统计数据 Hook
export function useInboxStats() {
  const [stats, setStats] = useState<InboxStats>({
    unread: 0,
    approved: 0,
    denied: 0,
    userVerifications: 0,
    propertyVerifications: 0,
    feedbacks: 0,
    todayActions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/inbox/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("Failed to fetch stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to fetch inbox stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}