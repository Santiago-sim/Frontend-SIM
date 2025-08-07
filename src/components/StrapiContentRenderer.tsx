"use client"

import React from "react"
import { StrapiBlock } from "@/types/strapi"

interface StrapiContentRendererProps {
  content: StrapiBlock[] | null
}

export function StrapiContentRenderer({ content }: StrapiContentRendererProps) {
  if (!content) return null

  const renderListItem = (item: any) => {
    if (item.children) {
      return item.children.map((child: any, index: number) => (
        <span key={index} className="text-gray-600">
          {child.text}
        </span>
      ))
    }
    return <span className="text-gray-600">{item.text}</span>
  }

  const renderBlock = (block: StrapiBlock, blockIndex: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={blockIndex} className="text-gray-600">
            {block.children.map((child: any, idx: number) => (
              <span key={idx}>{child.text}</span>
            ))}
          </p>
        )

      case 'list':
        const ListComponent = block.format === 'ordered' ? 'ol' : 'ul'
        const listClassName = block.format === 'ordered'
          ? "list-decimal pl-6 space-y-2"
          : "list-disc pl-6 space-y-2"

        return (
          <ListComponent key={blockIndex} className={listClassName}>
            {block.children.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex}>{renderListItem(listItem)}</li>
            ))}
          </ListComponent>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
