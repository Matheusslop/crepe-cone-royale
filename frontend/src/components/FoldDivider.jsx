// Signature element: a row of folded-crepe triangles used as a section divider
export default function FoldDivider({ color = '#5B2333', flip = false }) {
  return (
    <div className={`fold-divider ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 200 20" preserveAspectRatio="none">
        <polygon points="0,0 10,20 20,0 30,20 40,0 50,20 60,0 70,20 80,0 90,20 100,0 110,20 120,0 130,20 140,0 150,20 160,0 170,20 180,0 190,20 200,0" fill={color} />
      </svg>
    </div>
  )
}
