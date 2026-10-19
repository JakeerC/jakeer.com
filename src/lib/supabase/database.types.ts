export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DraftStatus =
  | "draft"
  | "branch_created"
  | "pr_open"
  | "merged"
  | "archived"
  | "failed";

export type ContentCategory = "writing" | "snippets" | "tools" | "notes";

export interface Database {
  public: {
    Tables: {
      content_drafts: {
        Row: {
          id: string;
          user_id: string;
          category: ContentCategory;
          title: string;
          slug: string;
          description: string | null;
          markdown: string | null;
          metadata: Json | null;
          branch_name: string | null;
          pr_number: number | null;
          status: DraftStatus;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: ContentCategory;
          title: string;
          slug: string;
          description?: string | null;
          markdown?: string | null;
          metadata?: Json | null;
          branch_name?: string | null;
          pr_number?: number | null;
          status?: DraftStatus;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: ContentCategory;
          title?: string;
          slug?: string;
          description?: string | null;
          markdown?: string | null;
          metadata?: Json | null;
          branch_name?: string | null;
          pr_number?: number | null;
          status?: DraftStatus;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_drafts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedSchema: "auth";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
