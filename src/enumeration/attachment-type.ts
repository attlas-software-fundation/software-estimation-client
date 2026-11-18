export type AttachmentTypeValue = "AVATAR" | "PDF"

export const AttachmentType = {
  AVATAR: "AVATAR",
  PDF: "PDF",
} as const satisfies Record<AttachmentTypeValue, AttachmentTypeValue>
