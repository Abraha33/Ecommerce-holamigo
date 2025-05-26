import type React from "react"

interface Props {
  params: { slug: string; subcategory: string }
}

const SubcategoryPage: React.FC<Props> = ({ params }) => {
  const { slug, subcategory } = params

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm py-4 sm:py-6 px-3 sm:px-4 overflow-hidden my-4 sm:my-6 md:my-8">
        <h1>
          Subcategory: {subcategory} (from category: {slug})
        </h1>
        {/* Add your subcategory content here */}
        <p>
          This is the content for the {subcategory} subcategory within the {slug} category.
        </p>
      </div>
    </div>
  )
}

export default SubcategoryPage
