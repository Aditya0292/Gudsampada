'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/shop/CartDrawer'
import StoryProgressIndicator from '@/components/story/StoryProgressIndicator'
import StoryAct1Land from '@/components/story/StoryAct1Land'
import StoryAct2Harvest from '@/components/story/StoryAct2Harvest'
import StoryAct3Fire from '@/components/story/StoryAct3Fire'
import StoryAct4Shape from '@/components/story/StoryAct4Shape'
import StoryAct5Products from '@/components/story/StoryAct5Products'
import StoryAct6People from '@/components/story/StoryAct6People'

export default function OurStoryPage() {
  return (
    <>
      <Header />
      <CartDrawer />
      <StoryProgressIndicator />
      <main className="w-full bg-cream overflow-hidden">
        {/* Act I: The Land */}
        <StoryAct1Land />

        {/* Act II: The Harvest */}
        <StoryAct2Harvest />

        {/* Act III: The Fire */}
        <StoryAct3Fire />

        {/* Act IV: The Shape */}
        <StoryAct4Shape />

        {/* Act V: The Products */}
        <StoryAct5Products />

        {/* Act VI: The People */}
        <StoryAct6People />
      </main>
      <Footer />
    </>
  )
}
