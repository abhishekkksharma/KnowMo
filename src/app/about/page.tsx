"use client"

import ContentBlock from '../../../components/about/ContentBlock'; // Adjust path as needed
import Image from "../../../assets/image.png"
import Image2 from "../../../assets/image2.png"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Container to restrict max width and center the content */}
      <div className="max-w-5xl mx-auto px-10 py-24 mt-6 md:py-40">

        {/* Separate Headings Section */}
        <header className="mb-24">
          <span className="text-gray-400 font-semibold text-[22px] tracking-">
            About KnowMo.
          </span>
          <h1 className="mt-4 text-4xl bg-pink-50 dark:bg-black md:text-5xl font-bold text-black dark:text-gray-50 tracking-">
            A story of late-night brainrots, relentless focus, and the pursuit of learning
          </h1>
        </header>

        {/* Content Section 1 - Image on Left */}
        <ContentBlock
          imagePosition="left"
          imageUrl={Image} // Replace with your image path
          imageAlt="People working on laptops at a desk"
          text={
            <p>
              {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis blanditiis fuga expedita suscipit fugiat saepe ducimus eius vel inventore totam, a atque cumque laboriosam sapiente error! Ipsam, quos perspiciatis. In id libero ex, quos ipsum minus consequatur sint aut adipisci! */}
              KnowMo (Know More) started as a late-night idea that turned into a platform for students like us—those who may not love taking notes in class but always find themselves searching for study material at the last minute.            </p>
          }
        />

        {/* Content Section 2 - Image on Right (Example toggle) */}
        <ContentBlock
          imagePosition="right"
          imageUrl={Image2}// Replace with your image path
          imageAlt="Person juggling tasks"
          text={
            <>
              {/* If your are reading this you're probably at the right place. The KnowMo. (Know More) is actually a late night thought turning into a platform for students like us who hate to right notes in classes but also thurst for the study content last minutes. */}
              <p>
                KnowMo is a community-driven learning platform built for Chitkara University students. It provides a single place to discover and share notes, study materials, guides, and resources contributed by students who have already walked the same academic path.
              </p>
              <p>
                While many existing platforms serve only a specific department or audience, KnowMo is designed for the entire university—bringing students together through collaboration, shared knowledge, and a commitment to helping one another succeed.
              </p>
            </>

          }
        />

      </div>
    </main>
  );
}