import { Story, Contributor } from '../types';

export const CONTRIBUTORS: Record<string, Contributor> = {
  siya: {
    id: 'siya',
    name: 'Siya',
    role: 'Lead Investigative Reporter & Producer',
    bio: 'Undergraduate student journalist specializing in campus labor, nocturnal infrastructure, and mutual-aid reporting.',
  },
  maya: {
    id: 'maya',
    name: 'Maya Chen',
    role: 'Head of Visuals & Documentary Photography',
    bio: 'Photographer and analog darkroom practitioner documenting collegiate subcultures and nocturnal shift work.',
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Staff Reporter & Records Researcher',
    bio: 'Reporter focusing on facilities governance, freedom of information inquiries, and public campus budgets.',
  },
  liam: {
    id: 'liam',
    name: 'Liam O’Connor',
    role: 'Audio Engineer & Video Documentarian',
    bio: 'Field recordist, sound designer, and documentary video editor for collegiate news packages.',
  },
  priya: {
    id: 'priya',
    name: 'Priya Patel',
    role: 'Fact-Checker & Archival Researcher',
    bio: 'Researcher auditing primary source documentation, chemical registries, and digital archive preservation.',
  },
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'dispatch-night-shift',
    slug: 'night-shift-of-campus-care',
    headline: 'The Night Shift of Campus Care: Inside the Invisible Infrastructure Keeping Student Life Moving',
    subheading: 'A deep fieldwork investigation into the nocturnal custodial crew, utility operators, and student transit staff.',
    summary: 'As lecture halls darken and dorms fall quiet, a dedicated cohort of custodial staff, lab safety monitors, and overnight transit operators take over. A deep look into the human backbone of nocturnal university life.',
    category: 'Campus',
    format: 'long-read',
    status: 'published',
    publishedAt: '2026-10-18',
    readingTime: 6,
    isLead: true,
    isDemo: true,
    authors: [CONTRIBUTORS.siya, CONTRIBUTORS.marcus],
    cover: {
      src: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
      alt: 'A solitary facility operator inspects the climate-controlled corridors of the main sciences complex at 2:40 AM.',
      credit: 'Maya Chen / The Dispatch',
      caption: 'A solitary facility operator inspects the climate-controlled corridors of the main sciences complex at 2:40 AM.',
      width: 1600,
      height: 1000,
    },
    sources: [
      {
        id: 's-1',
        title: 'Facilities Operations Annual Nocturnal Shift Log (FY2025-26)',
        organization: 'Campus Operations & Safety Department',
        date: '2026-09-15',
        note: 'Primary operational record documenting overnight staffing levels across 14 campus academic clusters.',
        verified: true,
      },
      {
        id: 's-2',
        title: 'Interview with Teresa Delgado, Lead Nocturnal Custodial Supervisor',
        organization: 'Fieldwork Recording #NS-04',
        date: '2026-10-12',
        note: 'Recorded at Central Facility Hub. Verified 18 years of service tenure with human resources records.',
        verified: true,
      },
      {
        id: 's-3',
        title: 'Night Transit & SafeWalk Quarterly Passenger Dispatch Data',
        organization: 'Student Union Auxiliary Services',
        date: '2026-10-02',
        note: 'Disclosed under campus transparency charter: average 412 nightly transit requests between midnight and 5 AM.',
        verified: true,
      },
      {
        id: 's-4',
        title: 'Campus Living Wage and Night Differential Policy Brief',
        organization: 'Campus Staff Advocacy Coalition',
        date: '2026-05-18',
        note: 'Comparative study of nocturnal wage differentials across provincial universities.',
        verified: true,
      },
    ],
    body: `### The Threshold of Midnight

At 11:15 PM on a damp Tuesday in mid-October, the university central quad undergoes an abrupt demographic inversion. The final cohort of undergraduate study groups filters out of the glass-fronted campus center, their conversational murmur dissolving into the autumn chill. Exterior path lighting switches automatically to low-intensity sodium amber to conserve municipal kilowatt hours. From the street, the campus appears extinguished—a dormant concrete archipelago waiting for the 8:00 AM introductory chemistry lecture.

Yet three stories below the damp grass, inside the subterranean network of utility tunnels connecting forty-eight academic pavilions, life is accelerating.

Teresa Delgado, fifty-four, adjusts her safety goggles and checks the digital pressure telemetry on Steam Boiler Header Four. For eighteen consecutive years, Delgado has arrived on campus at 10:45 PM, sliding her employee badge across the reinforced steel entrance of Central Utility Substation B. Along with thirty-six nocturnal facility specialists, custodial operators, and student van drivers, Delgado belongs to the invisible human infrastructure that keeps the university functional, sanitized, and warm.

"People assume a university is an intellectual abstraction—a place that exists purely in lecture halls, PDF syllabus files, and digital submission portals," Delgado says, using a brass spanner to inspect an insulated high-pressure bypass valve. "[Insert verified quotation: In reality, a campus is an industrial engine that produces sixty tons of waste and consumes four hundred thousand gallons of treated water every single day. If our team did not report for three consecutive shifts, this campus would grind to a dead halt.]"

### Behind the Sealed Classroom Doors

Delgado's shift partner, Marcus Vance, reviews the digital work-order queue on an industrial rugged tablet. By 1:30 AM, their team must sterilize and inspect seven specialized organic synthesis laboratories in the Chemistry Complex. Each room requires distinct containment protocols: positive-pressure air filtration locks, hazardous solvent waste pickups, and precise temperature calibrations for cryogenic specimen freezers that preserve twenty-two years of genetic research.

The labor is physically arduous, highly technical, and completely detached from the social rhythms of student life. While collegiate lifestyle accounts chronicle coffee runs and intramural athletic fixtures, Delgado's crew works through the coldest hours of the night, hauling high-temperature autoclaves, troubleshooting emergency ventilation scrubbers, and clearing biological contamination waste.

"The hardest part isn't the physical exertion; it’s the quiet," notes Raymundo Torres, an electrical apprentice who monitors the central high-voltage transformers along North Ridge. Torres graduated with a degree in civil engineering two years ago and chose the overnight shift to save money while supporting his extended family. "Between two and four in the morning, time stretches. You become hyper-aware of every hum in the ventilation ducts, every sensor click on the fire alarm panel."

### Transit in the Shadow Hours

Above ground, the quiet is punctuated by the rhythmic diesel rumble of the campus Night Shuttle. Operating continuously from 11:00 PM until 6:30 AM, the service provides point-to-point transit for student lab researchers, custodial employees, and off-campus residents navigating dark residential streets.

According to passenger dispatch logs reviewed by *The Dispatch*, the service conducted an average of 412 rides per night during the autumn midterm examination period. For drivers like Sarah Lindqvist, a twenty-two-year-old graduate student in public policy, driving the midnight perimeter is both a lifeline and an education in campus vulnerability.

"You meet everyone on this bus," Lindqvist explains while paused at a deserted transit shelter near the East Gates. "[Insert verified quotation: You drive graduate assistants who haven't slept in thirty hours, custodial workers heading to the 3 AM library sanitization run, and undergraduate students who missed the last commuter rail. We aren't just moving people around asphalt; we're keeping students safe when the city goes quiet.]"

### Institutional Recognition & The Living Wage Debate

Despite their vital contributions, nocturnal workers frequently find themselves excluded from university policy discussions and campus community initiatives. In April 2026, the Campus Staff Advocacy Coalition released a policy brief highlighting disparities in nocturnal wage differentials. While peer provincial institutions provide a fifteen to eighteen percent night-shift wage premium, Delgado's department currently receives an eight percent differential—a figure unchanged since 2018 despite cumulative regional inflation exceeding twenty-one percent.

During recent collective bargaining sessions, university administrators cited auxiliary service budget caps and provincial funding constraints. Yet for workers like Delgado, whose shifts span holidays, blizzards, and campus emergencies, compensation reflects respect as much as economic survival.

"We don't expect applause," Delgado says as the clock ticks past 4:45 AM, her team preparing the second sweep of lecture auditoriums before dawn breaks. "[Insert verified quotation: We just ask that when people walk into clean, heated, illuminated rooms tomorrow morning, they remember that somebody was awake all night making it possible.]"

At 6:30 AM, the first commuter buses arrive at the campus circle. The morning cleaning crew hands over keys to the daytime facilities desk. Delgado punches out, steps out into the crisp autumn morning, and begins her journey home—just as thirty thousand students begin to wake.`,
  },
  {
    id: 'dispatch-algorithm-archive',
    slug: 'algorithm-in-the-archive',
    headline: 'Algorithm in the Archive: How Digital Scarcity Is Reshaping Independent Student Journalism',
    subheading: 'An investigative audio documentary on the sudden disappearance of twenty years of collegiate digital records.',
    summary: 'An investigative audio documentary examining how algorithmic content moderation, digital paywalls, and social platform pivots are quietly erasing twenty years of campus historical records.',
    category: 'Investigations',
    format: 'audio',
    status: 'published',
    publishedAt: '2026-10-15',
    readingTime: 5,
    isLead: false,
    isDemo: true,
    authors: [CONTRIBUTORS.siya, CONTRIBUTORS.liam],
    cover: {
      src: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80',
      alt: 'Studio recording session for Episode 4 of The Dispatch Investigative Audio Series, hosted in Studio C.',
      credit: 'Maya Chen / The Dispatch',
      caption: 'Studio recording session for Episode 4 of The Dispatch Investigative Audio Series, hosted in Studio C.',
      width: 1600,
      height: 1000,
    },
    media: {
      type: 'audio',
      url: 'https://cdn.freesound.org/previews/428/428980_5121236-lq.mp3',
      duration: '07:42',
      transcript: `[AUDIO DOCUMENTARY SCRIPT]
TITLE: ALGORITHM IN THE ARCHIVE
HOST: Siya | PRODUCED BY: Siya & Liam O'Connor
RUNNING TIME: 07:42 | BROADCAST: OCT 15, 2026

[00:00 - 00:28] SOUND EFFECT: Tape reel clicks into place. Rhythmic mechanical hum, followed by the soft clacking of an old typewriter, cross-fading into modern keyboard clatter.
SIYA (NARRATOR): In 1974, a student reporter typed a 3,000-word exposé on university endowment investments in chemical weapons testing. It was printed on newsprint, distributed in 10,000 copies, and bound in buckram cloth. Fifty-two years later, I can walk down two flights of stairs into the basement archives, pull Volume 48 off the shelf, and read every single word. 

[00:29 - 01:05] MUSIC: Subtle, contemplative cello motif enters beneath narration.
SIYA: But if you want to read our student investigation from October 2014—just twelve years ago—detailing a multimillion-dollar housing conflict on North Campus? You get a blank screen: "404 Not Found. Domain hosting expired."
Welcome to The Dispatch Investigative Series. I'm Siya. Today, we investigate the paradox of digital memory: why the internet era is turning our collective campus history into a blank page.

[01:06 - 02:40] AUDIO CLIP: Professor Julian Morales, Director of Campus Media Preservation:
PROF. MORALES: "[Insert verified quotation: We assumed digital meant permanent. In reality, paper is the most durable archival medium invented by human beings. Bit-rot, bankrupt hosting providers, and CMS database migrations destroy more history every decade than library fires ever did in a century.]"
SIYA: Professor Morales has spent the last three years attempting to recover eighteen thousand articles published by student journalists between 1998 and 2016. He estimates that over forty percent of those pieces are permanently gone.

[02:41 - 04:15] SOUND EFFECT: Keyboard clicks, low digital synth drone.
SIYA: The issue isn't just accidental link rot. It's systemic economic change. In 2021, when major social media conglomerates altered their news referral algorithms, collegiate publications saw their external audience drop by sixty-eight percent overnight. To survive, publications pivoted to third-party subscription platforms and software-as-a-service content hubs. But what happens when that software company raises prices or goes out of business? 
LIAM (CO-HOST): "[Insert verified quotation: We surveyed twenty-four student editors across three provinces. Nineteen of them reported losing at least one full academic year of photographic archives during transitions between free hosting platforms.]"

[04:16 - 06:10] MUSIC: Swelling, urgent editorial strings.
SIYA: There's an accountability crisis at the core of this. When campus records disappear, the institutional memory required to hold university administrations accountable disappears with them. Student unions re-debate policies that were thoroughly investigated and resolved a decade prior, simply because nobody can find the original public reporting.
SIYA: We reached out to the Department of Digital Infrastructure to ask whether the university library allocates funding specifically for independent student paper archiving.
[AUDIO CLIP: Campus Archive Representative statement confirmation: Student publications operate as independent legal entities and are solely responsible for their own server infrastructure costs.]

[06:11 - 07:15] MUSIC: Reflective acoustic motif returns.
SIYA: The solution may lie in a return to open, decentralized digital preservation. Open-source initiatives like the Wayback Machine and the Student Press Law Center's archival mirror projects are stepping into the breach. Student developers right here on our campus have begun building open git-backed text archives that can be cloned and preserved by anyone.
SIYA: Because without our history, journalism cannot fulfill its fundamental promise: to remind power that someone is watching, and someone will remember.

[07:16 - 07:42] OUTRO CREDITS:
SIYA: "Algorithm in the Archive" was reported and written by Siya, with audio engineering, sound design, and field capture by Liam O'Connor. Fact-checking by Priya Patel and archival research by Marcus Vance. Special thanks to the Department of Media Studies for studio access.
Visit thedispatch.org for sources, audio files, and complete transcripts. This is The Dispatch.`,
    },
    sources: [
      {
        id: 'pod-s-1',
        title: 'Digital Preservation Coalition Campus Archive Audit 2025',
        organization: 'Independent Press Association',
        date: '2025-11-10',
        note: 'Comprehensive audit analyzing link-rot and missing archive databases across 48 student news publications.',
        verified: true,
      },
      {
        id: 'pod-s-2',
        title: 'Oral History Interview with Prof. Julian Morales',
        organization: 'Department of Media Studies & Archival Preservation',
        date: '2026-10-04',
        note: '42-minute primary interview focusing on the transition from microfiche to proprietary Content Management Systems.',
        verified: true,
      },
    ],
    body: `### Audio Summary & Production Overview

In this 7-minute and 42-second investigative podcast, *The Dispatch* investigates the quiet digital catastrophe confronting student newsrooms across North America: the gradual disappearance of their own history.

When campus newspapers migrated from physical print editions to early web platforms in the late 1990s, the promise was infinite democratized access. But today, broken CMS migrations, proprietary cloud paywalls, and social media algorithmic suppression have created what media historians call a "digital black hole"—with decades of investigative reporting vanishing without a trace.

Listen to the audio documentary above, or consult the complete verified broadcast script and transcript below.`,
  },
  {
    id: 'dispatch-darkroom-analog',
    slug: 'the-3am-darkroom-analog-revival',
    headline: 'The 3 A.M. Darkroom: The Quiet Revival of Analog Film in a Hyper-Digital Age',
    subheading: 'Eight documentary frames exploring silver halide, patience, and tangible darkroom craft.',
    summary: 'Amid endless smartphone feeds and algorithmic feeds, a growing community of student photographers is retreating into the red glow of the chemical darkroom. Eight documentary frames capturing silver halide, patience, and tangible craft.',
    category: 'Culture',
    format: 'photo',
    status: 'published',
    publishedAt: '2026-10-16',
    readingTime: 3,
    isLead: false,
    isDemo: true,
    authors: [CONTRIBUTORS.maya, CONTRIBUTORS.siya],
    cover: {
      src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=80',
      alt: 'Photographic prints drip-dry from stainless-steel wire lines in the fine arts communal darkroom at 3:15 AM.',
      credit: 'Maya Chen / The Dispatch',
      caption: 'Frame 1: Photographic prints drip-dry from stainless-steel wire lines in the fine arts communal darkroom at 3:15 AM.',
      width: 1600,
      height: 1000,
    },
    media: {
      type: 'gallery',
      photos: [
        {
          id: 'pf-1',
          url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1400&q=80',
          caption: '01 / THE DRYING LINE. Freshly developed 8x10 fiber prints hang from wooden clothespins above the washing sink. Each print represents roughly forty minutes of manual exposure balancing and chemical tray agitation.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Photographic prints drying on wires in darkroom',
          location: 'Visual Arts Darkroom 104',
        },
        {
          id: 'pf-2',
          url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80',
          caption: '02 / THE TOOLS OF PATIENCE. A mechanical 1978 SLR camera resting beside a Paterson film developing tank, heavy negative sleeves, and a brass grain focuser.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Vintage mechanical camera and darkroom equipment on table',
          location: 'Equipment Staging Bay',
        },
        {
          id: 'pf-3',
          url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80',
          caption: '03 / NEGATIVE CONTACT SHEET. Senior art student Elena Rostova examines a newly dried strip of Ilford HP5 400 film through a 4x magnifying loupe to inspect shutter synchronization.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Photographer looking closely at film negatives through magnifying loupe',
          location: 'Light Table Station 3',
        },
        {
          id: 'pf-4',
          url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1400&q=80',
          caption: '04 / THE CHEMICAL BATH. Tongs submerge an exposed sheet of multigrade paper into the developer tray. Within twelve seconds, the latent silver halides darken into rich carbon blacks.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Hands gently moving photographic print through liquid chemicals in tray',
          location: 'Chemical Sink Line',
        },
        {
          id: 'pf-5',
          url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1400&q=80',
          caption: '05 / AMBIENT AMBER. Safe light filters cast a warm amber glow across the chemical mixing station, where stop baths and rapid fixers are precisely calibrated to 20°C.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Amber safelight illuminating glass graduate cylinders and chemical bottles',
          location: 'Darkroom Chemical Prep Area',
        },
        {
          id: 'pf-6',
          url: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=1400&q=80',
          caption: '06 / FOCUS UNDER ENLARGER. Adjusting the bellows knob on a Beseler 23C enlarger to crop an architectural portrait before exposing the emulsion.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Enlarger lens projecting beam of light onto darkroom easel',
          location: 'Enlarger Station 6',
        },
        {
          id: 'pf-7',
          url: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=1400&q=80',
          caption: '07 / THE ARCHIVE BINDER. Archival polypropylene sleeves protecting decades of campus student work, categorized by date, emulsion batch, and chemical dilution.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Open binder filled with transparent sleeves of black and white negatives',
          location: 'Darkroom Society Archives',
        },
        {
          id: 'pf-8',
          url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
          caption: '08 / EMERGENCE AT SUNRISE. Two student photographers pack up their camera bags as daylight seeps through the basement ventilation shafts at 5:45 AM.',
          photographer: 'Maya Chen / The Dispatch',
          altText: 'Students walking out of darkroom hallway into early morning light',
          location: 'Fine Arts Sub-Basement Exit',
        },
      ],
    },
    sources: [
      {
        id: 'photo-s-1',
        title: 'Student Darkroom Society Equipment Registry & Chemical Log',
        organization: 'Faculty of Visual Arts & New Media',
        date: '2026-10-01',
        note: 'Documentation of a 140% surge in darkroom locker registrations over the past four semesters.',
        verified: true,
      },
    ],
    body: `### The Resistance to the Instant

In an academic environment saturated with instant notifications, AI image generation, and smartphone cameras that process fifty computational frames per millisecond, the physical darkroom represents an intentional act of resistance.

According to student registry logs, the university's Darkroom Society has witnessed a 140 percent surge in active keyholders over the past four semesters. For the students who spend their late nights bathed in amber safelight, the attraction lies precisely in what digital photography removes: physical limits, chemical alchemy, and the real possibility of failure.

"When you only have 36 exposures on a roll that costs eighteen dollars to purchase and develop, every single frame demands consideration," explains Elena Rostova, a third-year biology student who spends Friday nights in the sub-basement of the Fine Arts Building. "[Insert verified quotation: Chemical photography teaches a deliberate patience that directly transfers to scientific observation]."

Explore the documentary photo essay above using either the full editorial masonry grid or the sequential carousel.`,
  },
  {
    id: 'dispatch-mutual-aid-kitchen',
    slug: 'boiling-point-campus-mutual-aid',
    headline: 'Boiling Point: Inside the Student Mutual-Aid Kitchen Tackling Campus Food Insecurity',
    subheading: 'A 110-second documentary short on grassroots solidarity and student dignity amid rising grocery inflation.',
    summary: 'With grocery inflation outpacing student bursaries, a volunteer mutual-aid kitchen serves 450 hot meals every Tuesday. A 110-second documentary short on grassroots solidarity and student dignity.',
    category: 'Society',
    format: 'video',
    status: 'published',
    publishedAt: '2026-10-17',
    readingTime: 2,
    isLead: false,
    isDemo: true,
    authors: [CONTRIBUTORS.siya, CONTRIBUTORS.liam],
    cover: {
      src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80',
      alt: 'Volunteers prep locally rescued produce inside the Student Union Community Kitchen at 11:30 AM before the lunch rush.',
      credit: 'Maya Chen / The Dispatch',
      caption: 'Volunteers prep locally rescued produce inside the Student Union Community Kitchen at 11:30 AM before the lunch rush.',
      width: 1600,
      height: 1000,
    },
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '01:52',
      transcript: `[SHORT VIDEO BROADCAST SCRIPT]
TITLE: BOILING POINT — MUTUAL AID ON CAMPUS
RUNNING TIME: 01:52 (112 SECONDS)
REPORTER: Siya | CAMERA & EDIT: Liam O'Connor

[00:00 - 00:14] VISUAL: Rapid kinetic montage. Knife slicing through fresh cilantro; large ladle stirring a 40-liter industrial pot of steaming lentil stew; steam rising into fluorescent kitchen lights.
SIYA (VOICEOVER): It’s 10:30 AM in the basement of the Student Union. The university food court upstairs is selling eight-dollar breakfast muffins. But down here? The price is zero.

[00:15 - 00:36] VISUAL: Medium shot of volunteer coordinator Amina Kouri seasoning soup; cut to exterior queue of students outside the doors.
AMINA (ON CAMERA): "[Insert verified quotation: We refuse the charity model. Charity is top-down; mutual aid is lateral. When rent takes eighty percent of your paycheck, eating fresh vegetables shouldn’t be a luxury.]"
SIYA (VO): Amina is one of eighteen student volunteers behind The Common Pot. Every Tuesday, they turn 600 pounds of rescued farmers-market surplus into hot, dignified meals for over four hundred classmates.

[00:37 - 01:05] VISUAL: Graphical overlay on screen showing statistics from the National Campus Food Security Survey: 38.6% of students experience food insecurity. Cut to shots of students sitting at communal folding tables, laughing, sharing meals.
SIYA (VO): According to this year’s National Campus Food Security Report, nearly four in ten students report skipping meals to afford course textbooks and transit passes. What started as an emergency response during midterms has evolved into a permanent campus institution.

[01:06 - 01:34] VISUAL: Close-up of handwritten meal menu written on kraft butcher paper; volunteer handing a warm container to an engineering student.
STUDENT RECIPIENT: "[Insert verified quotation: It’s not just the meal. You come here between four hours of coding labs and someone asks how you’re doing. It’s the warmest place on campus.]"

[01:35 - 01:52] VISUAL: Wide shot of clean-up crew washing massive stainless pots together, music reaches uplifting crescendo. Lower-third graphic: "The Common Pot serves Tuesdays & Thursdays, Student Union B12."
SIYA (ON CAMERA STANDUP): In a semester defined by the rising cost of living, these students are proving that community care isn’t just a slogan—it’s an active recipe. For The Dispatch, I’m Siya.`,
    },
    sources: [
      {
        id: 'vid-s-1',
        title: 'National Campus Food Security Assessment Survey 2025-26',
        organization: 'Higher Education Research Consortium',
        date: '2026-03-12',
        note: 'Reveals 38.6% of enrolled undergraduates experienced moderate to severe food insecurity during term time.',
        verified: true,
      },
    ],
    body: `### Video Report Overview & Caption

**Headline:** Boiling Point: Inside the Student Mutual-Aid Kitchen Tackling Campus Food Insecurity  
**Format:** Short Video Report (112 seconds) | **Published:** October 17, 2026  

With food prices in collegiate neighborhoods climbing 9.4% over the past eighteen months, campus emergency food pantries are experiencing unprecedented queues. In response, a student-organized collective called *The Common Pot* has transformed an underutilized basement catering kitchen into a vibrant mutual-aid hub. Every Tuesday and Thursday, twenty volunteers rescue surplus produce from regional markets and transform it into 450 hearty, nutritious meals served with zero eligibility hurdles or stigma.

Watch our 110-second video report above, or read the complete broadcast script below.`,
  },
];
