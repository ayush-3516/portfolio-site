import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0b0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            background: 'linear-gradient(140deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 800,
            color: '#fff',
          }}
        >
          A
        </div>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#f4f5f8', letterSpacing: '-2px' }}>
          Ayush Chaudhari
        </div>
        <div style={{ fontSize: 22, color: '#9aa0b0' }}>
          Backend & Generative AI Engineer
        </div>
      </div>
    ),
    { ...size },
  )
}
