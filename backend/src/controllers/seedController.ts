import { Request, Response } from "express";
import Project from "../models/Project";
import FAQ from "../models/FAQ";
import Service from "../models/Service";
import AboutSlide from "../models/AboutSlide";

const projects = [
  {
    navigation: "mco",
    title: "Sustainable Living in Odisha",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    description: "My City Odisha (MCO) is a community-driven initiative focusing on sustainable urban development and heritage preservation.",
    tags: "Sustainability | Urban Development | Heritage"
  },
  {
    navigation: "addyfitness",
    title: "Fitness revolution in Motion",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066170/Copy_of_ADDY_FITNESS_q4vi2a.png",
    description: "Addy Fitness is redefining what it means to be fit. Fitness is more than just working out—it’s a mindset, a journey, and a way of life.",
    tags: "Branding | Social Media Growth | Wellness Community"
  },
  {
    navigation: "annapurna",
    title: "The Art of Baking",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066100/Copy_of_annapurna_bakery_mockup_ad93tu.png",
    description: "Annapurna Bakery is a heritage brand known for its artisanal breads and pastries. We updated their visual identity while preserving their traditional roots.",
    tags: "Food & Beverage | Brand Identity | Packaging"
  },
  {
    navigation: "desifunkaar",
    title: "Celebrating Cultural Narratives",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066097/Copy_of_desi_funkaar_mockup_vwhzt8.png",
    description: "Desi Funkaar is a platform for independent artists. We created a brand experience that is as vibrant and diverse as the artists it represents.",
    tags: "Culture | Talent Management | Experience Design"
  },
  {
    navigation: "ampverse",
    title: "Gaming and Lifestyle Redefined",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066141/Copy_of_ampverse_hrhaud.png",
    description: "Ampverse is leading the charge in gaming culture and lifestyle, creating immersive experiences for the next generation of gamers.",
    tags: "Gaming | Lifestyle | Content Creation"
  },
  {
    navigation: "addymeals",
    title: "Nutrition at Your Doorstep",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066145/Copy_of_addy_meals_rzn3mv.png",
    description: "Addy Meals brings healthy, delicious, and customized nutrition plans straight to you, making fitness goals easier to achieve.",
    tags: "Healthy Eating | Meal Prep | Wellness"
  },
  {
    navigation: "vyapaarveda",
    title: "Empowering Business Growth",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066139/Copy_of_vyapaarveda_llnfig.png",
    description: "Vyapaar Veda is dedicated to helping businesses scale through strategic planning, financial wisdom, and modern management techniques.",
    tags: "Business Strategy | Financial Consulting | Growth"
  },
  {
    navigation: "zomaland",
    title: "The Ultimate Food Festival",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066140/Copy_of_zomaland_ptnkjw.png",
    gallery: [
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066178/center_full_view_fuxyrn.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066177/box_office_tickets_aiqwpt.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066177/concert_branding_ivgubc.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066176/circle_rotation_wheel_uau98k.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066205/artist_on_stage_kergof.png"
    ],
    description: "Zomaland is a celebration of food, music, and fun. We brought the carnival to life with vibrant visuals and seamless digital integration.",
    tags: "Event Management | Visual Branding | Experience Design"
  },
  {
    navigation: "styletrends",
    title: "Leading the Fashion Curve",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_style_trends_mockup_xkq7sr.png",
    description: "Style Trends is your go-to source for the latest in fashion and lifestyle, curated for those who dare to stand out.",
    tags: "Fashion | Lifestyle | Editorial Design"
  },
  {
    navigation: "spectrum",
    title: "A Spectrum of Creativity",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_spectrum_windows_kvfufv.png",
    description: "Spectrum is a platform that celebrates diversity in art and design, bringing together different perspectives to create something truly unique.",
    tags: "Art Curation | Creative Community | Diversity"
  },
  {
    navigation: "puraanesikke",
    title: "Preserving Numismatic Heritage",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066095/Copy_of_puraane_sikke_mockup_r5sxjk.png",
    description: "Puraane Sikke is dedicated to collectors and enthusiasts of rare coins and currency, providing a platform to explore and trade history.",
    tags: "Numismatics | Rare Coins | Historical Collection"
  },
  {
    navigation: "odishareality",
    title: "Redefining Real Estate in Odisha",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066097/Copy_of_odisha_realty_mockup_bjkppv.png",
    description: "Odisha Realty brings the best property deals and real estate insights to the heart of Odisha, making home buying a seamless experience.",
    tags: "Real Estate | Property Consulting | Home Buying"
  },
  {
    navigation: "salty",
    title: "Jewellery that Speaks out",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066093/Copy_of_salty_mockup_awmb1y.png",
    description: "Salty isn’t just about jewelry—it’s about making a statement. Through visually stunning content, high-end branding, and an immersive digital experience.",
    tags: "Luxury Jewelry | High-End Accessories | Visual Storytelling"
  },
  {
    navigation: "annscafe",
    title: "Brewing Memories",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066141/Copy_of_Ann_s_cafe_dfnujk.png",
    description: "Ann's Cafe is more than just a coffee shop; it's a space where every cup is brewed with love and every visit becomes a cherished memory.",
    tags: "Cafe Culture | Coffee Branding | Community Space"
  },
  {
    navigation: "swiggy",
    title: "Delivering Happiness",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066138/Copy_of_Swiggy_uglgcx.png",
    gallery: [
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066215/swiggy_1_nthhv5.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066215/swiggy_2_ka9upq.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066215/swiggy_3_vwhhro.png",
      "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066207/swiggy_4_nf0ey6.png"
    ],
    description: "Our collaboration with Swiggy focused on enhancing the visual narrative of food delivery, making every order an anticipation of joy.",
    tags: "Food Delivery | Brand Partnership | Visual Storytelling"
  },
  {
    navigation: "sezzle",
    title: "Buy Now, Smile Now",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066091/Copy_of_sezzle_mockup_agwvwl.png",
    description: "Sezzle empowers consumers with flexible payment solutions. We helped translate their mission into a vibrant and approachable digital brand.",
    tags: "Fintech | Payment Solutions | Brand Identity"
  },
  {
    navigation: "khabariya-time",
    title: "Khabariya Time",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066129/Copy_of_vyapaarveda_ls4hmx.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066153/Copy_of_Copy_of_Khabariya_Time_ok2yar.mp4",
    description: "Khabariya Time is a dynamic news platform. We created a high-energy motion graphics package that brings news to life.",
    tags: "Motion Graphics | News Branding | Visual Identity"
  },
  {
    navigation: "katha",
    title: "Katha - Storytelling",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066133/Copy_of_desi_funkaars_mdh66r.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066151/Copy_of_Copy_of_Katha_u5fing.mp4",
    description: "Katha is a journey into the heart of storytelling. We used cinematic editing techniques to create an immersive narrative experience.",
    tags: "Cinematic Editing | Narrative | Storytelling"
  },
  {
    navigation: "promotional-video",
    title: "Promotional Excellence",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066135/Copy_of_ampverse_edlivk.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066150/Copy_of_Copy_of_Promotional_Video_rzk4vt.mp4",
    description: "Our promotional video work for leading brands focuses on high-impact visuals and clear, compelling messaging.",
    tags: "Commercial | Advertising | Video Production"
  },
  {
    navigation: "assembly-logo",
    title: "Assembly Logo Reveal",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_MCO_ep8zwv.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066148/Copy_of_Copy_of_Assembly_Logo_with_audio_wxkysk.mp4",
    description: "An audio-reactive logo reveal for Assembly, blending sound and motion into a seamless brand experience.",
    tags: "Logo Animation | Audio Reactive | Motion Design"
  },
  {
    navigation: "corporate-logo-3d",
    title: "3D Corporate Logo",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066139/Copy_of_Spectrum_s8aoad.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066148/Copy_of_Copy_of_3d_Corporate_logo_2_eezf3w.mp4",
    description: "We brought this corporate identity into the third dimension, creating a sense of depth and professionalism.",
    tags: "3D Animation | Professional | Brand Evolution"
  },
  {
    navigation: "panel-flip-reveal",
    title: "Panel Flip Logo Reveal",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066128/Copy_of_Style_Trends_kcbtaj.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066146/Copy_of_Copy_of_Panel_FLip_Logo_Reveal_wvoqel.mp4",
    description: "A creative panel-flip animation that adds a layer of mystery and excitement to the brand reveal.",
    tags: "Motion Design | Brand Reveal | Creative Animation"
  },
  {
    navigation: "dubai-ad",
    title: "Dubai Destination Ad",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_MCO_ep8zwv.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066131/Copy_of_Copy_of_Dubai_Ad_Video_For_Contest_gzzwfw.mp4",
    description: "A cinematic advertisement showcasing the luxury and vibrancy of Dubai, created for a global contest.",
    tags: "Travel Ad | Cinematic | Visual Production"
  },
  {
    navigation: "momazon-ad",
    title: "Momazon Brand Film",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066133/Copy_of_addy_meals_avpnqq.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066128/Copy_of_Copy_of_Momazon_Advertisement_qw0hxz.mp4",
    description: "We brought the Momazon brand to life with an advertisement that highlights care, quality, and convenience.",
    tags: "Commercial | Branding | Storytelling"
  },
  {
    navigation: "baby-footprint",
    title: "Baby Footprint Keepsake",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066136/Copy_of_annapurna_bakery_w6iilx.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066123/Copy_of_Copy_of_Baby_Hand_and_Footprint_gxmy24.mp4",
    description: "A heartwarming video capturing the precious moments of creating baby hand and footprint keepsakes.",
    tags: "Lifestyle | Heartwarming | Video Production"
  },
  {
    navigation: "character-animation",
    title: "Expressive Character Animation",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066133/Copy_of_desi_funkaars_mdh66r.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066123/Copy_of_Copy_of_Character_Animation_yr3iju.mp4",
    description: "Our team developed a unique character with fluid animations and expressive movements to tell a wordless story.",
    tags: "Character Design | 2D Animation | Storytelling"
  },
  {
    navigation: "iphone-case-ad",
    title: "iPhone Case Product Ad",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066128/Copy_of_Style_Trends_kcbtaj.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066121/Copy_of_Copy_of_Iphone_Case_Video_AD_Final_zskhni.mp4",
    description: "A sleek, high-energy product advertisement for iPhone cases, focusing on durability and style.",
    tags: "Product Ad | 3D Visualization | High-Energy"
  },
  {
    navigation: "instagram-ad",
    title: "Viral Instagram AD",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066135/Copy_of_ampverse_edlivk.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066121/Copy_of_Copy_of_Instagram_AD_joze2q.mp4",
    description: "Designed for the scroll-heavy environment of Instagram, this ad grabs attention in the first three seconds.",
    tags: "Social Media | Advertising | Viral Content"
  },
  {
    navigation: "cinematic-reel",
    title: "Illusory Cinematic Reel",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066129/Copy_of_zomaland_t6lzui.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066120/Copy_of_Copy_of_fINAL_oUTPUT_s3p1zt.mp4",
    description: "Our final output reel showcasing the best of our visual production and cinematic editing capabilities.",
    tags: "Showreel | Cinematic | Post-Production"
  },
  {
    navigation: "logo-intro",
    title: "Dynamic Logo Intro",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_MCO_ep8zwv.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066119/Copy_of_Copy_of_Logo_Intro_ncdk6a.mp4",
    description: "A powerful and dynamic logo introduction that sets the tone for any high-end brand presentation.",
    tags: "Motion Graphics | Branding | Logo Reveal"
  },
  {
    navigation: "pie-rooms-ad",
    title: "Pie Rooms Commercial",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066144/Copy_of_Odisha_Realty_z2eldq.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066118/Copy_of_Copy_of_Pie_Rooms_Commercial_Ad_tdl1ar.mp4",
    description: "A commercial advertisement for Pie Rooms, highlighting luxury living and modern architectural design.",
    tags: "Real Estate | Commercial | Advertising"
  },
  {
    navigation: "o-creme-ad",
    title: "O' Creme Luxury Ad",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066145/Copy_of_annapurna_bakery_it5ua6.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066116/Copy_of_Copy_of_O_CREME_Commercial_Final_w7gr98.mp4",
    description: "A luxury commercial for O' Creme, focusing on elegance, taste, and premium brand positioning.",
    tags: "Luxury Ad | Food Branding | Cinematic"
  },
  {
    navigation: "motion-graphics-reel",
    title: "Motion Graphics Showcase",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066218/Pexels_zfuujg.jpg", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066200/Motion_Graphics_yasj6n.mp4",
    description: "A comprehensive showcase of our motion design capabilities, from kinetic typography to complex 3D animations.",
    tags: "Motion Design | 3D Animation | Showreel"
  },
  {
    navigation: "vernal-product-ad",
    title: "Vernal Product Showcase",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066161/Copy_of_salty_uxmu0v.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066115/Copy_of_Copy_of_Vernal_Product_Final_qz4fc2.mp4",
    description: "The final output for the Vernal product campaign, blending product photography with dynamic motion.",
    tags: "Product Ad | Branding | Motion Design"
  },
  {
    navigation: "storyboard-motion-reel",
    title: "Storyboard to Motion Reel",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066218/camerarails_hlhpqi.jpg", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066201/Storyboard_Motion_Graphics_Reel_qubv4y.mp4",
    description: "Witness the journey from initial sketches to final animation. This reel highlights our creative process and technical execution.",
    tags: "Motion Graphics | Creative Process | Animation"
  },
  {
    navigation: "pale-blue-dot",
    title: "The Pale Blue Dot Animation",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066139/Copy_of_Spectrum_s8aoad.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066115/Copy_of_Copy_of_The_Pale_Blue_Dot_Animation_atl61j.mp4",
    description: "A philosophical animation inspired by 'The Pale Blue Dot', exploring our place in the universe through visual art.",
    tags: "Animation | Philosophical | Visual Storytelling"
  },
  {
    navigation: "calendar-motion",
    title: "Dynamic Calendar Motion",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066128/Copy_of_Style_Trends_kcbtaj.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066161/Copy_of_Copy_of_Calender_t5isrx.mp4",
    description: "A sleek calendar motion graphic that turns scheduling into a visual experience, perfect for productivity apps.",
    tags: "Motion Design | UI Animation | Productivity"
  },
  {
    navigation: "dynamic-slide-1",
    title: "Dynamic Visual Slide I",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066135/Copy_of_ampverse_edlivk.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066159/Copy_of_Copy_of_Dynamic_Slide_1_n0sjrq.mp4",
    description: "The first in a series of dynamic transition slides, blending color and motion to create seamless visual flows.",
    tags: "Motion Graphics | Transitions | Abstract"
  },
  {
    navigation: "n95-mask-ad",
    title: "N95 Mask Product Film",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066138/Copy_of_Swiggy_uglgcx.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066159/Copy_of_Copy_of_N95_Mask_ehmfv9.mp4",
    description: "A clean and professional product film for N95 masks, focusing on protection, breathability, and quality.",
    tags: "Product Ad | Healthcare | Commercial"
  },
  {
    navigation: "product-reveal-4",
    title: "Creative Product Reveal",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066137/Copy_of_sezzle_rokmd1.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066158/Copy_of_Copy_of_4_umjc5w.mp4",
    description: "A high-impact product reveal sequence that uses bold lighting and fast-paced editing to create anticipation.",
    tags: "Motion Design | Branding | High-Impact"
  },
  {
    navigation: "denim-brand-film",
    title: "Denim Lifestyle Film",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066140/Copy_of_Style_Trends_odh6ee.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066156/Copy_of_Copy_of_Denim_c8fick.mp4",
    description: "A lifestyle-focused brand film for a denim label, capturing the texture, fit, and attitude of the product.",
    tags: "Fashion Film | Lifestyle | Commercial"
  },
  {
    navigation: "creative-motion-1",
    title: "Creative Motion Showcase I",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066143/Copy_of_MCO_ep8zwv.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066156/Copy_of_Copy_of_1_wbjqaf.mp4",
    description: "A creative exploration of motion and form, pushing the boundaries of traditional animation techniques.",
    tags: "Experimental | Motion Graphics | Visual Art"
  },
  {
    navigation: "myntra-fashion-ad",
    title: "Myntra Fashion Campaign",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066140/Copy_of_Style_Trends_odh6ee.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066155/Copy_of_Copy_of_Myntra_m9lvv1.mp4",
    description: "Our collaboration with Myntra for a seasonal campaign, featuring high-energy transitions and trend-focused visuals.",
    tags: "Fashion Ad | Commercial | E-commerce"
  },
  {
    navigation: "music-concert-film",
    title: "The Concert Experience",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066140/Copy_of_zomaland_ptnkjw.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066154/Copy_of_Copy_of_Music_Concert_tuf8md.mp4",
    description: "Capturing the raw energy and emotion of a live music concert through cinematic videography and high-fidelity sound.",
    tags: "Event Film | Music | Cinematic"
  },
  {
    navigation: "dynamic-slide-2",
    title: "Dynamic Visual Slide II",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066139/Copy_of_vyapaarveda_llnfig.png", // Fallback image
    video: "https://res.cloudinary.com/dqlmblh5i/video/upload/v1768066154/Copy_of_Copy_of_Dynamic_Slide_2_nhktwu.mp4",
    description: "Continuing our exploration of visual flow, this slide uses geometric patterns and fluid motion to captivate.",
    tags: "Motion Graphics | Transitions | Geometric"
  },
  {
    navigation: "app-design-showcase",
    title: "App Interface Design",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066185/Screenshot_2024-12-03_135545_zlyu2n.png",
    description: "A deep dive into our mobile and web application design philosophy, focusing on user-centric interfaces and seamless interaction flows.",
    tags: "UI/UX | App Design | Digital Product"
  },
  {
    navigation: "6degree-store",
    title: "6 Degree Store Branding",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066240/6Degreestore2-01_vk42bw.jpg",
    description: "Elevating the digital retail experience for 6 Degree Store through sophisticated visual storytelling and brand strategy.",
    tags: "E-commerce | Branding | Digital Retail"
  },
  {
    navigation: "aristobrat",
    title: "Aristobrat Brand Evolution",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066239/aristobrat-01_ztgzou.jpg",
    description: "Redefining modern luxury for Aristobrat, blending classic elegance with contemporary digital design.",
    tags: "Lifestyle Branding | Luxury | Creative Direction"
  },
  {
    navigation: "noise-x-sezzle",
    title: "Noise x Sezzle Campaign",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066238/NoisexSezzle-01_f30s1w.jpg",
    description: "A collaborative campaign between Noise and Sezzle, focusing on high-energy visuals and seamless payment integration.",
    tags: "Brand Collaboration | Campaign Design | Fintech"
  },
  {
    navigation: "flo",
    title: "Flo Wellness Branding",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066237/flo-01_tvcknw.jpg",
    description: "Crafting a serene and approachable brand identity for Flo, centered around wellness and modern lifestyle.",
    tags: "Wellness | Visual Identity | Health & Lifestyle"
  },
  {
    navigation: "purple-panchi",
    title: "Purple Panchi Fashion",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066237/purplepanchi-01_xlxp8u.jpg",
    description: "A vibrant fashion campaign for Purple Panchi, celebrating color, tradition, and contemporary style.",
    tags: "Fashion Branding | Editorial | E-commerce"
  },
  {
    navigation: "plum-goodness",
    title: "Plum Goodness Visuals",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066237/plum-01_vtwtfc.jpg",
    description: "Enhancing the clean beauty narrative for Plum Goodness through refreshing visuals and product-focused design.",
    tags: "Beauty Branding | Product Design | Sustainability"
  },
  {
    navigation: "skullcandy",
    title: "Skullcandy High-Energy Ad",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066236/skullcandy-01_lqly5s.jpg",
    description: "Capturing the raw energy and attitude of Skullcandy through bold graphic design and high-impact layouts.",
    tags: "Audio Branding | High-Energy | Commercial Design"
  },
  {
    navigation: "norm",
    title: "Norm Minimalist Branding",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066236/norm-01_adpqdj.jpg",
    description: "A study in minimalism and functional design for Norm, where less is more and clarity is key.",
    tags: "Minimalism | Functional Design | Brand Strategy"
  },
  {
    navigation: "specsmakers",
    title: "Specsmakers Digital Identity",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066236/specsmakerssale-01_zr0rh1.jpg",
    description: "Modernizing the eyewear shopping experience for Specsmakers with a focus on style and accessibility.",
    tags: "Retail Branding | Eyewear | Digital Transformation"
  },
  {
    navigation: "vardenchi",
    title: "Vardenchi Custom Motorcycles",
    image: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066220/vardenchi-01_pcihxs.jpg",
    description: "Capturing the craftsmanship and engineering excellence of Vardenchi custom motorcycles through cinematic visuals.",
    tags: "Automotive Design | Craftsmanship | Visual Storytelling"
  }
];

const faqs = [
  {
    question: "What makes you unique?",
    answer: "Illusory Design Studios is a one-stop solution for all things creative, seamlessly blending design, strategy, and innovation. From concept to execution, we tailor our approach to meet diverse needs, ensuring every project captivates its audience, enhances brand presence, and delivers lasting impact—all under one roof."
  },
  {
    question: "Do you offer flexible packages or custom solutions?",
    answer: "Yes, Illusory Design Studios provides flexible packages and custom solutions tailored to each client’s specific requirements. We understand that no two projects are alike, so we collaborate closely with clients to create bespoke service packages that align with their vision, goals, and budget."
  },
  {
    question: "What types of businesses and industries do you specialize in?",
    answer: "We collaborate with businesses of all sizes, from visionary startups to established enterprises. Our expertise transcends industries, shaping compelling narratives and impactful designs across dynamic sectors, ensuring every brand stands out, engages meaningfully, and leaves a lasting impact. This versatility ensures that we provide innovative and effective solutions regardless of business type or industry."
  },
  {
    question: "How do you integrate trends and technologies into your work?",
    answer: "We stay ahead by continuously updating our knowledge and tools to incorporate the latest industry trends and technologies. Whether it’s advanced design software, data-driven digital marketing tools, or innovative content creation techniques, Illusory ensures clients benefit from cutting-edge solutions in every project."
  },
  {
    question: "What can I expect during the onboarding process with your team?",
    answer: "The onboarding process at Illusory is seamless and client-focused. We start with an in-depth consultation to understand your goals, followed by strategic planning to align our comprehensive services with your vision."
  },
  {
    question: "Do you work with businesses of all sizes and what is the project timeline?",
    answer: "Yes, we work with businesses of all sizes, from small enterprises to large organizations, across multiple industries. Project timelines vary based on the scope and complexity of the work but are defined during the consultation phase to ensure effective project management, seamless communication, and timely delivery."
  },
  {
    question: "How do you ensure quality across services, and how can I work with your team?",
    answer: "Illusory Design Studios employs a structured approach involving collaborative teams and multi-stage quality checks to maintain consistency across all our services, from creative design to marketing and production. To get started, reach out for an initial consultation where we’ll discuss your needs, outline our approach, and create a tailored action plan."
  },
  {
    question: "Do you offer online and offline branding services, including rebranding or scaling?",
    answer: "Definitely ! At Illusory, we provide a full spectrum of services that seamlessly blend digital and traditional branding. From website design and social media management to printed materials, interior design with architectural planning, and event promotion and execution, we cover it all."
  }
];

const services = [
  {
    link: "/services",
    textHead: "Creative Designing",
    words: [
      { text: "DESIGN", color: "#26E9FF" },
      { text: "UI/UX", color: "#000000" },
      { text: "BRANDING & PACKAGING DESIGN", color: "#FF1284" },
      { text: "LOGO DESIGNING", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Visual Production",
    words: [
      { text: "GRAPHICS", color: "#26E9FF" },
      { text: "2D & 3D ANIMATION", color: "#000000" },
      { text: "POST-PRODUCTION", color: "#FF1284" },
      { text: "STORYBOARDING", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Capturing Moments",
    words: [
      { text: "DRONE SHOOTS", color: "#26E9FF" },
      { text: "RETOUCHING", color: "#000000" },
      { text: "PRODUCT SHOOTS", color: "#FF1284" },
      { text: "PHOTOGRAPHY", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Event & Talent Management",
    words: [
      { text: "Event Planning", color: "#FF1284" },
      { text: "Artist & Influencer Management", color: "#26E9FF" },
      { text: "Corporate Events", color: "#000000" },
      { text: "Gaming Events", color: "#FF1284" },
      { text: "Virtual & Hybrid Events", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Digital Marketing",
    words: [
      { text: "Social Media", color: "#FF1284" },
      { text: "SEO", color: "#26E9FF" },
      { text: "Performance Ads", color: "#000000" },
      { text: "Content Strategy", color: "#FF1284" },
      { text: "Email & WhatsApp Marketing", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Web & App Development",
    words: [
      { text: "Websites", color: "#FF1284" },
      { text: "E-commerce", color: "#26E9FF" },
      { text: "Mobile Apps", color: "#000000" },
      { text: "Custom Solutions", color: "#FF1284" },
      { text: "UI/UX Development", color: "#26E9FF" }
    ]
  },
  {
    link: "/services",
    textHead: "Branding",
    words: [
      { text: "Brand Identity", color: "#FF1284" },
      { text: "Development", color: "#26E9FF" },
      { text: "Strategy", color: "#000000" },
      { text: "Communication", color: "#FF1284" },
      { text: "Management", color: "#26E9FF" }
    ]
  }
];

const aboutSlides = [
  {
    section: "About Us",
    num: "01",
    title: "Rules? We Hack 'Em",
    body: "At Illusory Design Studios, creativity isn’t just a job—it’s a full-blown rebellion. We don’t conform, we break boundaries, we make things explode in ways people didn’t even know they needed."
  },
  {
    section: "About Us",
    num: "02",
    title: "Crafted to Stop Thumbs.",
    body: "In a world where everyone’s scrolling mindlessly, we create designs that make them hit pause. Our work is the kind that gets people talking, asking, “How the hell did they think of that?” every time."
  },
  {
    section: "About Us",
    num: "03",
    title: "No Limits. Just Big Dreams.",
    body: "We don’t believe in limitations. We see every project as an open canvas to push the envelope—creating something that leaves a mark, something unforgettable. Your brand deserves to be legendary."
  },
  {
    section: "About Us",
    num: "04",
    title: "The Playground of the Bold.",
    body: "From crazy visuals to viral campaigns, from influencer magic to unforgettable weddings—we work in every creative space possible. We’re not just creating; we’re disrupting the entire game."
  },
  {
    section: "Mission",
    num: "01",
    title: "Clients? Nah, We Roll with Visionaries",
    body: "This isn’t a service line — it’s a frontline. We move with the brands that break patterns and build presence. No gimmicks. No hand-holding. Just clear vision, sharp execution, and work that speaks before we do."
  },
  {
    section: "Mission",
    num: "02",
    title: "Brutal Precision: Built on Trust, Delivered in Pixels",
    body: "This isn’t a service line — it’s a frontline. We move with the brands that break patterns and build presence. No gimmicks. No hand-holding. Just clear vision, sharp execution, and work that speaks before we do."
  },
  {
    section: "Vision",
    num: "01",
    title: "Setting the Pace for the Future",
    body: "At Illusory, our vision is to lead—not follow—in shaping how brands engage, influence, and endure. We aspire to become a benchmark in creative innovation, where every idea sparks progress and every brand built sets the tone for what's next."
  },
  {
    section: "Vision",
    num: "02",
    title: "Building Legacy Through Limitless Growth",
    body: "We see beyond business—we see potential. Rooted in collaboration and driven by innovation, we aim for growth that outlasts and impact that resonates. Because in our vision, success isn’t seasonal—it’s generational."
  }
];

export const seedDatabase = async (req: Request, res: Response) => {
  try {
    // Clear existing data
    await Project.deleteMany({});
    await FAQ.deleteMany({});
    await Service.deleteMany({});
    await AboutSlide.deleteMany({});

    // Read configured cloud name (fallback to default)
    let activeCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!activeCloudName || activeCloudName === "undefined" || activeCloudName === "null" || activeCloudName.trim() === "") {
      activeCloudName = "dqlmblh5i";
    }
    
    // Dynamically replace default developer cloud name in project images and videos
    const mappedProjects = projects.map(project => {
      const mapped = { ...project };
      if (typeof mapped.image === "string" && mapped.image.includes("res.cloudinary.com/dqlmblh5i/")) {
        mapped.image = mapped.image.replace(/res\.cloudinary\.com\/dqlmblh5i\//g, `res.cloudinary.com/${activeCloudName}/`);
      }
      if (typeof mapped.video === "string" && mapped.video.includes("res.cloudinary.com/dqlmblh5i/")) {
        mapped.video = mapped.video.replace(/res\.cloudinary\.com\/dqlmblh5i\//g, `res.cloudinary.com/${activeCloudName}/`);
      }
      if (Array.isArray(mapped.gallery)) {
        mapped.gallery = mapped.gallery.map(img => {
          if (typeof img === "string" && img.includes("res.cloudinary.com/dqlmblh5i/")) {
            return img.replace(/res\.cloudinary\.com\/dqlmblh5i\//g, `res.cloudinary.com/${activeCloudName}/`);
          }
          return img;
        });
      }
      return mapped;
    });

    // Seed new data
    await Project.insertMany(mappedProjects);
    await FAQ.insertMany(faqs);
    await Service.insertMany(services);
    await AboutSlide.insertMany(aboutSlides);

    res.json({ message: "Database seeded successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
