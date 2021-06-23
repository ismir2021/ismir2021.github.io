---
layout: page
permalink: /tutorials/
title: Accepted Tutorials at ISMIR 2021 
---
{% include toc.html %}

### 1. Tempo, Beat, and Downbeat Estimation

The highly interrelated topics of tempo, beat, and downbeat estimation from musical audio signals have spanned the entire history of MIR. Along with many MIR topics, the uptake of deep learning has fundamentally altered how these rhythm-oriented tasks have been addressed and has led to a profound increase in performance. This tutorial seeks to position itself within this narrative by providing a high-level understanding of historical signal processing-oriented approaches leading to hands-on practical experience in building, training, and evaluating the most recent state-of-the-art deep learning approaches. Our goal is not only to expose participants to a complete rhythm analysis pipeline, but also to emphasize the importance of technical and musical design choices, the reliability of annotated data, and multidisciplinarity. In addition, we seek to provide insight into common pitfalls and discuss future challenges.

The tutorial is targeted towards those in the ISMIR community who wish gain comprehensive insight and practical experience in tempo, beat, and downbeat estimation of musical audio signals. For those new to this area, we seek to provide a hands-on technical and pedagogical guide which can serve as the basis for fostering future research. For those with prior knowledge in the area, we hope to convey a solid understanding of recent advances and current state-of-the-art approaches. As a prerequisite for participation, we would expect some basic experience in the execution of python notebooks.

**Biography of Presenters**

**Matthew E. P. Davies** is a researcher in the Centre for Informatics and Systems of the University of Coimbra (CISUC), Portugal. His research interests include the analysis of rhythm in musical audio signals, evaluation methodology, creative music applications, and reproducible research. His most recent research has addressed the use of compact deep neural networks for the analysis of rhythmic structure, and computational ethnomusicology.

**Sebastian Böck** received his diploma degree in electrical engineering from the Technical University in Munich and his Ph.D. in computer science from the Johannes Kepler University Linz. Within the MIR community he is probably best known for his machine learning-based algorithms and as the principal maintainer of open source python library, madmom. Currently he works as an AI research engineer for enliteAI in Vienna, Austria.

**Magdalena Fuentes** is a Provost&#39;s Postdoctoral Fellow at the Music and Audio Research Lab and the Center for Urban Science and Progress of New York University (NYU). She completed her Ph.D. at Université Paris Saclay on multi-scale computational rhythm analysis, with focus on the interaction of microtiming, beats, downbeats and music structure. Her research interests include Machine Listening, Self-Supervised Representation Learning, Computational Rhythm Analysis and Environmental Sound Analysis.

### 2. Designing Generative Models for Interactive Co-creation

Recent advances in generative modeling have enabled AI systems to create realistic musical outputs, and additionally offer exciting potential to assist a broad range of music creators. However, these models have limitations that impose a unique set of challenges when embedded in interactive environments.

How do we design generative models and interactions that enable new creative (or co-creative) possibilities, while at the same time addressing real musical needs and user goals? This tutorial covers a range of considerations that come into play when using AI as a design material for creative musical interactions: identifying user needs and interaction opportunities, translating our high-level interactive objectives into actionable ML problems, (crudely) codifying desired behavior or aesthetics into quantitative metrics that can be hill-climbed during model development, and identifying cadences for evaluating progress with users in controlled experiments and in the wild. This process might span multiple projects or papers, with each diving deeper on different aspects of the process. We will draw from our own experiences and projects, highlighting choices that we made and reflecting on what we might do differently next time as we trace the lifecycle of these projects from research to the real world and back.

This tutorial will be geared towards anyone with some experience in MIR who is not already working at the intersection of music generative modeling and human interaction but may be interested in learning more. The primary purpose of this tutorial is to demystify this daunting process: we will offer guidelines and point out pitfalls, keeping in mind that there is no one-size-fits-all protocol. We hope that attendees will leave the tutorial with a clearer understanding of the challenges associated with designing, building, and evaluating interactive music AI experiences, and strategies which may help them overcome these obstacles.

**Biography of Presenters**

**Anna Huang** is a Research Scientist at Google Brain, working on the Magenta project. Her research focuses on designing generative models and tools to make music more interactive and approachable. She is the creator of Music Transformer, and the ML model Coconet that powered Google&#39;s first AI Doodle, Bach Doodle. She holds a PhD from Harvard University, masters from the MIT Media Lab, and a dual bachelor&#39;s degree in computer science and music composition from University of Southern California. She is currently co-advising students at Mila, the Quebec AI Institute. She is also a guest editor for TISMIR&#39;s Special Issue on AI and Musical Creativity, and a judge and organizer for the international AI Song Contest.

**Jon Gillick** is a PhD Candidate at the School of Information at UC Berkeley, where he is also affiliated with the Center for New Music and Audio Technologies (CNMAT). His research centers around exploring new ways of creating and interacting with music and sound using machine learning. Before coming to Berkeley, he studied Computer Science at Wesleyan University in Connecticut and Music Composition and Production at the Pyramind Music Production Institute in San Francisco, and he spent time working in the Bay Area as both a freelance composer/audio engineer and as a software developer.

**Chris Donahue** is a postdoc at Stanford University in the computer science department. The primary goal of his research is to build AI systems which help humans be more creative. In practice, this often involves both improving generative models and designing new interactive environments which make these models more useful to humans. In a music context, he is particularly interested in how generative models may allow non-musicians to unlock their dormant musical creativity. Before Stanford, Chris completed his Ph.D. at UC San Diego, where he was co-advised by Miller Puckette (music) and Julian McAuley (CS).

### 3. Scales, Chords, and Cadences: Practical Music Theory for MIR Researchers

Much pitch-related MIR research builds either implicitly or explicitly on music-theoretic domain knowledge. Unfortunately, music theory is an esoteric discipline, with many of its canonical organizational principles presented in textbooks with dozens of classical musical examples and little indication of how these principles can be applied to other musical traditions. This tutorial will introduce fundamental pitch-related concepts in music theory for the ISMIR community and relate them to tasks associated with melodic, chord, and structural audio analysis for a range of musical styles. It will include sections on the scales, chords, and cadences routinely associated with Western art music of the common-practice tradition (~1650-1900), as well as non-Western folk musics and the popular music traditions of the twentieth and twenty-first centuries. The three sections will be broken down as follows, with both lecture and hands-on coding demonstration components:

- Scales
  - Scale formation (octave equivalence, mathematical properties)
  - Scale and mode types (western and non-Western)
  - Implications for scale and key identification, automatic melody extraction
- Chords
  - Types (triads, seventh chords, extensions)
  - Representation schemes (e.g., chord labeling)
  - Syntactic principles (e.g., functional harmony, grammars)
  - Implications for automatic chord recognition, pattern discovery
- Cadences
  - Types
  - Linear/voice-leading patterns
  - Relationship to large-scale formal types (phrases, themes, sonata, etc.)
  - Implications for cadence discovery/classification, automatic segmentation


This tutorial will be of interest to a broad range of the ISMIR community, but will be of specific interest to MIR researchers with limited formal training in music theory. This workshop assumes a basic understanding of musical notation, but does not assume prior knowledge of Western music theory. It will be accessible to researchers new to the field, but will also be of interest to experienced researchers hoping to incorporate more music-theoretically based models into their research.

**Biography of Presenters**

**Johanna Devaney** is an Assistant Professor at Brooklyn College and the CUNY Graduate Center, where she teaches courses in data analysis, music technology, music theory, and sonic arts. Her research focuses on interdisciplinary approaches to the study of musical performance, with a particular focus on the relationship between pitch structure and intonation in the singing voice. More broadly, she examines the ways in which recorded performances can be used to model performance and develops computational tools to facilitate this, primarily the Automatic Music Performance Analysis and Comparison Toolkit (AMPACT). Johanna has been active in the ISMIR community since 2008, giving the WiMIR keynote in 2020 and currently serving on the TISMIR editorial board. She holds a PhD in Music Technology from McGill University.

**David R. W. Sears** is an Assistant Professor of Interdisciplinary Arts and Co-Director of the Performing Arts Research Lab at Texas Tech University, where he teaches courses in arts psychology, arts informatics, and music theory. His current research examines the structural parallels between music and language using both behavioral and computational methods, with a particular emphasis on the many topics associated with pitch structure, including scale theory, tonality, harmony, cadence, and musical form. Recent publications appear in his [Google Scholar profile](https://scholar.google.com/citations?user=yuphd6EAAAAJ&amp;hl=en). He holds a PhD in music theory from McGill University.

**Daniel Shanahan** is an Associate Professor of Music Theory and Cognition at Ohio State University. He is interested in studying musical transmission, musical communication, and jazz improvisation, and likes to explore these topics with both experimental and computational tools. Daniel&#39;s work has been published in Music Perception, The Journal of New Music Research, Musicae Scientiae, and many other outlets. He is an editor of the forthcoming Oxford Handbook of Corpus Studies in Music and has been managing editor of Empirical Musicology Review since 2012, serving as the journal co-editor since 2016. He also serves on the editorial boards of Music Theory Spectrum, Musicae Scientiae, and Indiana Theory Review. He holds a PhD in music theory from the University of Dublin, Trinity College.

### 4. Music Classification: Beyond Supervised Learning, Towards Real-world Applications

Music classification is a music information retrieval (MIR) task to classify music items to labels such as genre, mood, and instruments. It is also closely related to other concepts such as music similarity and musical preference. In this tutorial, we put our focus on two directions - the recent training schemes beyond supervised learning and the successful application of music classification models.

The target audience for this session is researchers and practitioners who are interested in state-of-the-art music classification research and building real-world applications. We assume the audience is familiar with the basic machine learning concepts. For those who are not, we kindly refer to [1, 2] to be prepared for this session.

We plan to present three lectures as follows:

1. Music classification overview: Task definition, applications, existing approaches, datasets
2. Beyond supervised learning: Semi- and self-supervised learning for music classification
3. Towards real-world applications: Less-discussed, yet important research issues in practice

We provide an accompanying code repository and Jupyter notebooks that can be used along with the video presentation. With the material, attendees can easily train semi- and self-supervised models with their own audio data.

[1] [A Tutorial on Deep Learning for Music Information Retrieval, Keunwoo Choi et al., 2017](https://arxiv.org/abs/1709.04396) (Concepts in deep learning) [https://arxiv.org/abs/1709.04396](https://arxiv.org/abs/1709.04396)

[2] [An Introduction to Statistical Learning, Daniela Witten et al., 2013](https://www.statlearning.com/) (Chapter 2-4 for ML fundamentals) https://www.statlearning.com/

**Biography of Presenters**

**Minz Won** is a Ph.D candidate at the Music Technology Group (MTG) of Universitat Pompeu Fabra in Barcelona, Spain. His research focus is music representation learning. Along with his academic career, he has put his knowledge into practice with industry internships at Kakao Corp., Naver Corp., Pandora, Adobe, and ByteDance. He contributed to the winning entry in the WWW 2018 Challenge: Learning to Recognize Musical Genre.

**Janne Spijkervet** graduated cum laude from the University of Amsterdam in 2021 with her Master&#39;s thesis titled &quot;Contrastive Learning of Musical Representations&quot;. The paper with the same title was published in 2020 on self-supervised learning on raw audio in music tagging. She has started at ByteDance as a research scientist (2020 - present), developing generative models for music creation. She has also been active in the music industry as a music producer and consultant.

**Keunwoo Choi** received a Ph.D degree from Queen Mary University of London, London, UK, in 2018, with a thesis titled &quot;Deep neural networks for music tagging&quot; under supervision of Mark Sandler, György Fazekas (QMUL), and Kyunghyun Cho (NYU). He has been working as a research scientist at ByteDance (2020 - Present) and Spotify (2018 - 2020), developing machine learning products for music recommendation and discovery. He has been also involved in several other music companies as a part-time researcher, intern, and external consultant and in open-source projects such as Kapre, librosa, and torchaudio.

### 5. Programming MIR Baselines from Scratch: Three Case Studies

This tutorial will walk through the creation of MIR baselines programmed live, including pitch tracking, instrument identification, and drum transcription. Each case study will start with building a system and finish with evaluations and visualization/sonification, each using different tools and styles of programming. This tutorial is both beginner and experienced programmer-friendly and will start from the basics but will move quickly. While the tutorial is not interactive, all code will be made available afterwards.

**Biography of Presenters**

**Rachel Bittner** is a Senior Research Scientist at Spotify in Paris. She received her Ph.D. in Music Technology in 2018 from the Music and Audio Research Lab at New York University under Dr. Juan P. Bello, with a research focus on deep learning and machine learning applied to fundamental fre- quency estimation. She has a Master&#39;s degree in mathematics from New York University&#39;s Courant Institute, as well as two Bachelor&#39;s degrees in Music Performance and in Mathematics from the University of California, Irvine. In 2014-15, she was a research fellow at Telecom ParisTech in France after being awarded the Chateaubriand Research Fellowship. From 2011-13, she was a member of the Human Factors division of NASA Ames Research Center, working with Dr. Durand Begault. Her research interests are at the intersection of audio signal processing and machine learning, applied to musical audio. She is an active contributor to the open-source community, including being the primary developer of the pysox and mirdata Python libraries.

**Mark Cartwright** is an Assistant Professor at New Jersey Institute of Technology in the Department of Informatics. He completed his PhD in computer science at Northwestern University as a member of the Interactive Audio Lab, and he holds a Master of Arts from Stanford University (CCRMA) and a Bachelor of Music from Northwestern University. Before his current position, he spent four years as a researcher in the Music and Audio Research Lab (MARL) and the Center for Urban Science and Progress (CUSP) at New York University (NYU). His research lies at the intersection of human-computer interaction, ma- chine learning, and audio signal processing. Specifically, he researches human- centered machine listening and audio processing tools for creative expression with sound and understanding the acoustic world.

**Ethan Manilow** is a PhD candidate in Computer Science at Northwestern University under advisor Prof. Bryan Pardo. His research lies in the inter- section of signal processing and machine learning, with a focus on source separation, automatic music transcription, and open source datasets and applications. Previously he was an intern at Mitsubishi Electric Research Labs (MERL) and at Google Magenta. He is one of the lead developers of nussl, an open source audio separation library. He lives in Chicago, where he spends his free time playing his guitar and smiling at dogs he passes on the sidewalk.

### 6. Teaching Music Information Retrieval

The research field of Music Information Retrieval (MIR) has a history of more than 20 years. During this time many different tasks have been defined and a variety of algorithms have been proposed. MIR topics are taught around the world in a variety of settings both in academia and industry. The teaching of MIR takes many forms ranging from teach- ing regular undergraduate and graduate courses to deliver- ing specialized tutorials, seminars, and online courses. MIR is a fundamentally interdisciplinary topic and that creates unique challenges when it is taught. The goal of this tuto- rial is to cover various topics of interest to people involved with teaching MIR. The material covered is informed by modern pedagogical practices and how these practices can be adapted to address the unique characteristics of learning about MIR. The global Covid pandemic has resulted in in- creased activity and interest about online learning. Advice and guidelines for effective online teaching of MIR will also be provided. The presented concepts and ideas will be il- lustrated using concrete examples and use cases drawn from extensive experience of the tutorial presenter with teaching MIR in a variety of settings.

**Biography of Presenters**

**George Tzanetakis** is a Professor in the Department of Computer Science with cross-listed appointments in ECE and Music at the University of Victoria, Canada. He was Canada Research Chair (Tier II) in the Computer Analysis and Audio and Music from 2010 to 2020. In 2012, he received the Craigdaroch research award in artistic expres- sion at the University of Victoria. In 2011 he was Visiting Faculty at Google Research. He received his PhD in Com- puter Science at Princeton University in 2002 and was a Postdoctoral fellow at Carnegie Mellon University in 2002- 2003. His research spans all stages of audio content analysis such as feature extraction,segmentation, classification with specific emphasis on music information retrieval.

He has designed and developed for Kadenze Inc. the first widely available online program in Music Information Retrieval consisting of 3 courses that were launched in December 2020. More than 2000 students from around the world have been involved with the program. He is also the primary designer and developer of Marsyas an open source framework for audio processing with specific empha- sis on music information retrieval applications. His pioneer- ing work on musical genre classification received a IEEE sig- nal processing society young author award and is frequently cited. He has given several tutorials in well known interna- tional conferences such as ICASSP, ACM Multimedia and ISMIR. More recently he has been exploring new interfaces for musical expression, music robotics, computational eth- nomusicology, and computer-assisted music instrument tu- toring. These interdisciplinary activities combine ideas from signal processing, perception, machine learning, sensors, ac- tuators and human-computer interaction with the connect- ing theme of making computers better understand music to create more effective interactions with musicians and listen- ers. More details can be found http://www.cs.uvic.ca/ gtzan.