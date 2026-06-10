"use client";
import React, { useEffect, useRef } from "react";
import { App } from "../components/App";
import Carousel from "./components/services-main-component";
import {
  graphicDesign,
  brandIdentity,
  marketingCollateral,
  advertising,
  uiux,
  trend,
  eventManagement,
  videoEditing,
  motionGraphics,
  production,
  photography,
  corporate,
  cinematic,
  architecture,
  branding,
  artist,
  gaming,
  livePerformance,
  virtual,
  customEvent,
  seo,
  ppc,
  email,
  voice,
  clientReputation,
  whatsapp,
  ecommerce,
  specializedVideo,
  videoCustomization,
  eventPerformance,
  eventPlanning,
  videoProduction,
  socialMarketing
} from "../config/services";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "../components/Marquee";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);
const Services = () => {
  const container = useRef(null);
  useEffect(() => {
    // Create the timeline for the animation
    const tl = gsap.timeline({ paused: true });

    tl.to(container.current, {
      opacity: 1,
      duration: 1.2, // Duration of the animation
      backgroundColor: "white",
      color: "black",
      ease: "power3.out", // Easing for smooth animation
    });
    tl.reverse();
    // Function to trigger animation based on scroll position
    const handleScroll = () => {
      const servicesElement = document.querySelector("#carousel");

      // Check if servicesElement is not null
      if (servicesElement) {
        const rect = servicesElement.getBoundingClientRect();

        // Check if the element is in the viewport (you can adjust the threshold as needed)
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
          tl.play(); // Start the animation when the element comes into view
        } else {
          tl.reverse(); // reverse the animation when it's out of view
        }
      }
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [container]);
  return (
    <>
      <App
        head1="Purpose-built"
        head2="strategies for"
        head3="success of"
        head4="your brand."
      />
      <section ref={container} id="carousel" className="">
        {/* Carousel No. : 1 */}
        <Carousel
          title="Creative Designing"
          body="Designing isn’t just about aesthetics—it’s about making a statement. We craft visuals that don’t just catch the eye but ignite conversations, demand attention and leave a lasting impression."
          cards={[
            {
              logo: graphicDesign,
              title: "Graphic Design",
              description:
                "Your brand’s first impression matters. We craft stunning logos that speak volumes about who you are and design business cards that leave a mark. From vibrant flyers to bold banners and captivating brochures, we bring your message to life. Need a unique touch? Our custom illustrations add personality, while packaging designs turn products into works of art. We make your social media graphics pop and create presentation decks that command attention. Let’s turn your brand into a visual masterpiece!",
            },
            {
              logo: brandIdentity,
              title: "Brand Identity",
              description:
                "Your brand is your story, and we’re here to help you tell it. We create an entire logo suite that gives you flexibility, paired with clear brand guidelines to maintain consistency across every touchpoint. From signature styles to social media templates, we ensure your brand speaks the same language, wherever it’s seen. Let’s build an identity that’s as unique as you are!",
            },
            {
              logo: marketingCollateral,
              title: "Marketing Collateral",
              description:
                "It’s not just about looking good; it’s about standing out! Whether you need pitch decks that impress or product packaging that grabs attention, we’ve got you covered. We design event booths that draw crowds, email marketing visuals that make inboxes pop, and advertising creatives that stop people in their tracks. Let’s create marketing materials that spark excitement and elevate your brand.",
            },
            {
              logo: advertising,
              title: "Advertising & Corporate",
              description:
                "Get noticed and stay memorable with designs that speak to your audience. Our advertisements aren’t just seen—they’re felt. From huge billboards that command attention to social media ads that convert, we ensure your brand stands out. Whether it’s corporate stationery or high-impact motion graphics, we create designs that showcase your professionalism and creativity. Ready to make your brand unforgettable?",
            },
            {
              logo: uiux,
              title: "UI/UX",
              description:
                "The best designs are the ones that feel effortless. We design websites and apps that guide users with ease, from wireframes to interactive features that keep them engaged. With a focus on accessibility, we make sure your audience has a seamless experience, no matter where they are or what device they’re using. Let's create something that users love to interact with.",
            },
            {
              logo: trend,
              title: "Trend & Innovation",
              description:
                "Stay ahead of the game with the latest in design innovation! We bring cutting-edge AR/VR experiences and futuristic AI-driven designs to life, making your brand an experience rather than just a product. Our designs are not only current but set the trend for what’s next. Let’s explore new possibilities and make your brand the talk of the town!",
            },
            {
              logo: eventManagement,
              title: "Invitation & Event Design",
              description:
                "The invitation is just the beginning. From elegant invitations to complete event branding, we design every element to set the tone. Whether it's an intimate gathering or a grand corporate affair, we bring your event themes to life. Our digital invitations add a modern twist, while our attention to detail makes sure every event moment is unforgettable. Let’s create an experience that everyone will remember.",
            },
          ]}
        />
        {/* Carousel No. : 2 */}
        <Carousel
          title="Visual Production"
          body="Visuals that break the mold and push boundaries. We transform raw ideas into jaw-dropping visuals with flawless editing, mind-blowing VFX, and cinematic storytelling. It’s not just content—it’s an experience that doesn’t just look good—it leaves a lasting mark."
          cards={[
            {
              logo: videoEditing,
              title: "Video Editing",
              description:
                "Every great video starts with flawless editing. From basic cutting to cinematic editing, we ensure your video speaks volumes. Color correction for that perfect look, slow-motion and time-lapse editing for dramatic effects, plus 360° video and VR videos for immersive experiences. Whether it’s green screen keying, multi-camera edits, or adding subtitles & captions, we craft videos that captivate and engage.",
            },
            {
              logo: motionGraphics,
              title: "Motion Graphics",
              description:
                "Transform your visuals into eye-catching masterpieces with motion graphics. From VFX to kinetic typography, we add the magic that makes your content unforgettable. Whether it’s creating dynamic text animations, adding creative social media animations, or infusing your videos with cartoon animations, we give your content that extra punch that keeps your audience hooked.",
            },
            {
              logo: videoProduction,
              title: "Corporate & Commercial Video Production",
              description:
                "Your brand deserves to be seen ! Our corporate video production ensures your business shines. We create impactful advertisements and commercials that grab attention, along with compelling product videos that highlight what you offer. Need event coverage? Our event videography captures every moment. From testimonials & interviews to breathtaking drone videography, we bring your brand’s story to life.",
            },
            {
              logo: specializedVideo,
              title: "Specialized Video Production",
              description:
                " Looking to push boundaries? Our specialized video production covers everything from high-energy music videos to captivating short films. Want to tell an in-depth story? We excel in web series and documentary-style production that will leave your audience hooked and coming back for more.",
            },
            {
              logo: videoCustomization,
              title: "Video Customization & Templates",
              description:
                "Customization is key! We tailor video templates for your brand, creating corporate training and e-learning videos that inform and engage. From YouTube video editing to creating highlight-worthy reels, we help you stand out with content that speaks directly to your audience. Need something unique? Title sequences and animated infographics add a professional touch to your videos.",
            },
            {
              logo: production,
              title: "Post-Production",
              description:
                "The magic happens in post-production. We perfect your videos with expert sound design and audio editing. Need social media-ready content? We specialize in social media video edits that will catch your audience’s eye. Whether it’s films or ads, our team ensures your video is polished and ready for the world.",
            },
          ]}
        />

        {/* Carousel No. : 3 */}
        <Carousel
          title="Capturing Moments"
          body="Moments that deserve more than a snapshot. We freeze time in a way that captures the essence and emotion, making it unforgettable."
          cards={[
            {
              logo: photography,
              title: "Product & Commercial Photography",
              description:
                "Want your products to scream BUY ME? We provide single product shoots with lighting so sharp, it cuts through the noise. Monthly product shoots that keep your feed fresh and flying. From styling to post-production, we make it pop! Campaigns? Hell yes, we do brand activation, influencer collabs, product demos, and event coverage like no one else. E-Commerce? You get multi-angle views, perfect branding, and shots that'll have customers hitting 'Add to Cart' without a second thought.",
            },
            {
              logo: eventPerformance,
              title: "Event & Performance Coverage",
              description:
                "Weddings? We got the pre-wedding buzz, candid wedding day moments, and the post-wedding magic all covered. Concert/event coverage? From crowd engagement to after movies, we capture the chaos and energy. Big corporate event? We're in, with everything from conference coverage to executive portraits. And sports & music videos? Expect action shots, live performance magic, and behind-the-scenes realness.",
            },
            {
              logo: corporate,
              title: "Corporate & Professional Photography",
              description:
                "Need corporate headshots that make you look like a boss? We’re talking studio or environmental portraits—your personal brand is about to level up. For the fashionistas, we bring it with model shoots in-house or on-location, killer styling, and a touch of editorial magic. Got drones? Oh yeah, we’re bringing aerial shots and cinematic angles that’ll leave you speechless.",
            },
            {
              logo: photography,
              title: "Creative & Lifestyle Photography",
              description:
                "Want your fitness shots to explode with energy? We’ll get you those perfect gym shots, or chill outdoor lifestyle photos with a dash of health and wellness. Travel & adventure? From destination vibes to wildlife wonder, we’re in it for the epic. Time-lapse & hyperlapse? Get ready for urban cityscapes and nature shots that bend time and reality.",
            },
            {
              logo: cinematic,
              title: "Specialty & Artistic Shoots",
              description:
                "Looking for that perfect food shot? We make every dish look like art, with menu photography and those mouth-watering action shots. Baby & maternity? We nail those precious moments with maternity poses and newborn magic. Got a pet? Studio or outdoor, we get those adorable candid moments every time. And for the brave? Underwater photography that brings the marine life, fashion, and commercial shots to life.",
            },
            {
              logo: architecture,
              title: "Architecture & Real Estate Photography",
              description:
                "Great properties don’t just get noticed—they dominate. We don’t do “nice” shots; we create jaw-dropping property photography & videography, paired with cinematic aerial drone shots that make your listings look like a million bucks. Whether you need a virtual tour, time-lapse video, or architectural visuals, consider it handled. From residential interiors to commercial properties, we bring your real estate shots to life. Architecture & interior design? We craft perfect lighting setups, flawless composition, and highlight every intricate detail, turning every angle into a masterpiece.",
            },
            {
              logo: branding,
              title: "Show Reel & Branding",
              description:
                "Ready for visuals that punch harder than anything else out there? Drone photography & videography that takes your content to the skies with jaw-dropping aerial views. Documentary & time-lapse visuals that turn everyday moments into cinematic legends. And our motion graphics & animation? We don’t just make content; we create pure visual art that moves, engages, and sticks with your audience long after the screen goes black.",
            },
          ]}
        />

        {/* Carousel No. : 4 */}

        <Carousel
          title="Event & Artist Management"
          body="Creating an event that becomes the talk of the town. Some moments aren’t just meant to be remembered—they’re meant to be relived. We don’t just capture memories; we bottle up emotions, stories, and the energy that makes them unforgettable."
          cards={[
            {
              logo: eventPlanning,
              title: "Event Planning & Coordination",
              description:
                "You think you’ve seen it all? Think again. We manage end-to-end event logistics with surgical precision, ensuring no detail is left to chance. Need a theme that makes your event unforgettable? We don’t just brainstorm—we conceptualize unique event themes that will have everyone talking. We handle vendor coordination and on-site management like pros, making sure everything clicks. Invitations and RSVPs? We don’t let a single person slip through the cracks. And on the big day? We make sure everything executes without a hitch, so you can actually enjoy the damn event.",
            },
            {
              logo: artist,
              title: "Influencer & Artist Management",
              description:
                "We don’t just work with influencers and artists; we build stars. From scouting top talent to making them feel like they were born for your brand, we handle it all. No vague deals here—we craft contracts that demand results. We don’t just manage; we build strong relationships, ensuring influencers are locked in, just like you are. Need a promotional tour or event to push your brand to the next level? We’ve got the connections to make it happen. Digital marketing & Performance Tracking? Our roster of influencers turns brand promotions into viral sensations online, spreading your brand like wildfire. We keep it real and deliver the numbers.",
            },
            {
              logo: gaming,
              title: "Corporate & Gaming Events",
              description:
                "Want a corporate event that isn’t just some boring talkfest? We curate corporate conferences and team-building sessions that ignite energy and creativity. Hackathons and gaming tournaments? We make them legendary, not just competitive. We set up the technical requirements for virtual participation, ensuring no one is left out of the action. Our networking event design brings value, not just small talk, and our execution of high-profile launches? On point. You won’t find a more solid crew to make your event a hit.",
            },
            {
              logo: livePerformance,
              title: "Live Performances",
              description:
                "Ready to bring the house down? We book artists and performers across genres, making sure your event has the right vibe. We don’t do half-assed setups—we manage technical setups for performances that make everything sound and look epic. From event promotion through media and social platforms to coordinating rehearsals and scheduling, we do it all to keep your performance tight. And when the spotlight is on, we’re there real-time monitoring and issue resolution so nothing ruins the show.",
            },
            {
              logo: virtual,
              title: "Virtual & Hybrid Events",
              description:
                "Old-school events are out. Hybrid and virtual is the future. We integrate virtual elements into live events, making sure you get the best of both worlds. We don’t just throw up a live stream and call it a day—we design interactive virtual platforms that keep attendees engaged and talking. From managing live-streaming and digital engagements to hosting virtual meet-and-greets or panel discussions, we bring the heat in the digital world. And we make sure the technological robustness for hybrid events is tight—no glitches, no delays. Just seamless execution.",
            },
            {
              logo: customEvent,
              title: "Customized Event Enhancements",
              description:
                "We don’t just add flair—we create mind-blowing experiences. Want to amp up your event with AR/VR activations? Done. We take it further with event-specific apps that turn your guests into loyal fans and make ticketing smoother than ever. Need photo-op setups that make Instagram blow up? We’ve got it. And we don’t stop there. After the event, we provide post-event analytics and reports to prove how successful your event was. We’re also all about sustainability with eco-friendly event solutions, because why not make your event unforgettable and planet-friendly !!",
            },
          ]}
        />

        {/* Carousel No. : 5 */}

        <Carousel
          title="Digital Marketing"
          body="Your brand is ready to take over the digital space. We don’t just create campaigns—we engineer digital strategies that captivate, ignite curiosity, and drive measurable results. Every click, every scroll, every interaction is designed to turn every click into a powerful connection."
          cards={[
            {
              logo: socialMarketing,
              title: "Social Media Marketing",
              description:
                "We don’t just create content calendars—we mastermind them. Targeted ad campaigns across platforms? Done. We own the community, engaging your audience like it’s our own. Need influencer-driven campaigns that hit the sweet spot for your niche? You got it. Plus, with our multi-channel analytics, we don’t just optimize—we dominate.",
            },
            {
              logo: seo,
              title: "Search Engine Optimization (SEO)",
              description:
                "Forget basic SEO. We crush it with technical audits, on-page optimization, and insane keyword research. We don’t just build backlink profiles, we make them unstoppable. Local SEO? We make sure your brand owns the local spotlight, while our SEO-driven content strategies make you impossible to ignore.",
            },
            {
              logo: ppc,
              title: "PPC & Paid Media Campaigns",
              description:
                "We take your budget and stretch it like a rubber band on Google and Meta ads. Retargeting campaigns? We turn them into ROI machines. A/B testing? We use it to fine-tune and max out your campaign. We monitor everything in real-time, making sure your campaigns never stop hitting hard.",
            },
            {
              logo: email,
              title: "Email Marketing",
              description:
                "We build jaw-dropping email templates that wow and are responsive across all devices. Segmented lists? We create campaigns so personalized, your audience will feel like it’s meant for them alone. Our drip campaigns are lead-magnets, and with real-time performance tracking, we shift gears whenever needed. CRM integration? We make everything flow seamlessly.",
            },
            {
              logo: voice,
              title: "Voice & Metaverse Marketing",
              description:
                "We don’t just adapt to voice search; we make it your brand’s voice on smart assistants. We build immersive brand spaces in the metaverse that make your audience feel like they’re part of something bigger. AR filters? We create them to drive engagement like never before. Plus, we explore blockchain to take your marketing to the next level, using data-driven profiling to make sure your audience is always engaged.",
            },
            {
              logo: clientReputation,
              title: "Client Reputation Management (Analytics)",
              description:
                "We track your brand’s reputation with precision—whether it’s online reviews or customer sentiment, we’ve got it covered. With analytics, we not only protect your reputation but enhance it, turning feedback into brand-strengthening opportunities. We make sure your brand stays at the top, always shining.",
            },
            {
              logo: videoEditing,
              title: "Video Marketing",
              description:
                "We don’t just create videos, we craft cinematic experiences that keep your audience glued to the screen. From brand storytelling to product demos, every video we produce is strategically designed to convert. Social media videos? We make them shareable, driving engagement through the roof, create ad campaigns that convert, we don’t just produce content—we craft movements.. YouTube, Instagram, TikTok, and beyond—our videos make waves across every platform. Every frame is meticulously planned to captivate, inspire, and drive ROI. Forget forgettable ads.",
            },
            {
              logo: whatsapp,
              title: "WhatsApp Marketing (API)",
              description:
                "People check messages—we make sure they check yours first. With API-driven automation, bulk messaging, and personalized sequences, we turn WhatsApp into instant engagement machines. Whether it’s a flash sale, event reminder, or exclusive offer, our high-impact messages land straight in your audience’s hands—sparking action, boosting engagement, and driving sales.",
            },
            {
              logo: ecommerce,
              title: "E-Commerce Marketing",
              description:
                "Your e-commerce store needs more than just products on a page. We drive traffic, increase sales, and boost conversions through targeted campaigns and optimized strategies. With our approach, we integrate PPC, SEO, and email marketing, ensuring your online presence is constantly growing, and your sales are skyrocketing.",
            },
          ]}
        />
      </section>
      <Marquee />
      <FAQ />
      <Footer />
    </>
  );
};

export default Services;
