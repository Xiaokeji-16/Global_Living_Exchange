// app/types/inbox.ts

/**
 * Inbox 消息类型
 */
export type InboxType = 
  | "user_verification"      // 用户身份验证
  | "property_verification"  // 房产审核
  | "feedback";              // 用户反馈

/**
 * 事件类型
 */
export type EventType = 
  | "upload"   // 上传（新提交）
  | "verify"   // 待审核
  | "feedback" // 反馈

/**
 * Inbox 状态
 */
export type InboxStatus = 
  | "unread"   // 未读（待处理）
  | "approve"  // 已批准
  | "deny";    // 已拒绝

/**
 * Inbox 条目接口（对应 Supabase inbox_items 表）
 */
export interface InboxItem {
  id: string;                    // UUID
  type: InboxType;               
  status: InboxStatus;           
  event_type: EventType;         
  
  // 引用字段
  reference_id: string;          // 指向实际数据的 UUID
  reference_table: string;       // 'user_verifications' | 'properties' | 'feedbacks'
  
  // 用户信息
  user_id: string | null;        // clerk_user_id
  user_name: string | null;
  user_email: string | null;
  
  // 审核信息
  reviewed_by: string | null;    // 审核人的 clerk_user_id
  reviewed_at: string | null;    // ISO timestamp
  review_note: string | null;
  
  // 时间戳
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}

/**
 * 用户验证详情（联表查询结果）
 */
export interface InboxUserVerification extends InboxItem {
  type: "user_verification";
  // 来自 user_verifications 表的字段
  verification_id?: string;
  clerk_user_id?: string;
  verification_status?: string;
  doc_url?: string | null;
  user_note?: string | null;
  verification_created_at?: string;
}

/**
 * 房产验证详情（联表查询结果）
 */
export interface InboxPropertyVerification extends InboxItem {
  type: "property_verification";
  // 来自 properties 表的字段
  property_id?: string;
  title?: string;
  city?: string | null;
  country?: string | null;
  host_id?: string | null;
  verification_status?: string | null;
  property_created_at?: string;
}

/**
 * 反馈详情（联表查询结果）
 */
export interface InboxFeedback extends InboxItem {
  type: "feedback";
  // 来自 feedbacks 表的字段
  feedback_id?: string;
  category?: string;
  subject?: string;
  message?: string;
  priority?: string | null;
  feedback_status?: string;
  feedback_created_at?: string;
}

/**
 * 联合类型：所有 Inbox 类型
 */
export type AnyInboxItem = 
  | InboxUserVerification 
  | InboxPropertyVerification 
  | InboxFeedback;

/**
 * Inbox 列表响应
 */
export interface InboxListResponse {
  items: InboxItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Inbox 过滤选项
 */
export interface InboxFilterOptions {
  type?: InboxType | InboxType[];
  status?: InboxStatus | InboxStatus[];
  user_id?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 审核操作请求
 */
export interface ReviewActionRequest {
  inboxId: string;
  action: "approve" | "deny";
  note?: string;
  reviewedBy: string;
}

/**
 * 批量操作请求
 */
export interface BulkActionRequest {
  inboxIds: string[];
  action: "approve" | "deny";
  note?: string;
  reviewedBy: string;
}

/**
 * 统计数据
 */
export interface InboxStats {
  unread: number;
  approved: number;
  denied: number;
  userVerifications: number;
  propertyVerifications: number;
  feedbacks: number;
  todayActions: number;
}

/**
 * Supabase 数据库类型（从 Supabase 生成的类型）
 */
export interface Database {
  public: {
    Tables: {
      inbox_items: {
        Row: InboxItem;
        Insert: Omit<InboxItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<InboxItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_verifications: {
        Row: {
          id: string;
          clerk_user_id: string;
          status: string;
          doc_url: string | null;
          note: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_comment: string | null;
          created_at: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          city: string | null;
          country: string | null;
          host_id: string | null;
          verification_status: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_comment: string | null;
          created_at: string;
        };
      };
      feedbacks: {
        Row: {
          id: string;
          user_id: string;
          user_name: string | null;
          user_email: string | null;
          category: string;
          subject: string;
          message: string;
          attachments: string[] | null;
          priority: string | null;
          status: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_comment: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Views: {
      inbox_user_verifications: {
        Row: InboxUserVerification;
      };
      inbox_property_verifications: {
        Row: InboxPropertyVerification;
      };
      inbox_feedbacks: {
        Row: InboxFeedback;
      };
    };
  };
}