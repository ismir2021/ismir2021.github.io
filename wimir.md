---
layout: page 
permalink: /wimir/
title: Women in MIR
---

## WiMIR Keynote

We are pleased to have **Dr. Laurel S. Pardue**, Software Engineer at Ableton Live, as our WiMIR keynote speaker.

### Improving Diversity and Inclusivity Through Action

Lack of diversity and inclusion within a community means that important ideas and viewpoints are missing; a community’s needs are missed or misrepresented, data is more likely to be biased, and human beings can end up feeling and being excluded. The music technology and machine learning fields are known for long-standing issues in diversity with members being largely white, male, able-bodied, and originating from wealthy countries. While there are systemic challenges to broadening a community, this talk will introduce Dr. Pardue’s work on improving accessibility of musical performance before concentrating on potential actionable ways to make the research community more inclusive including focusing diversity and inclusivity efforts beyond the single strata of gender to incorporate ethnicity, language, disability, experience, and more.

### Dr. Laurel S. Pardue

Dr. Laurel S. Pardue has worked in music technology and instrument design for over 15 years.  She focuses on real-world, real-time performance, designing and building instruments including Gamelan Elektrika (debuted in collaboration with Kronos Quartet at the NY Lincoln Center in 2010), the world’s first electronic tabla, Tabla Touch, with Kuljit Bhamra (launched 2020), and most recently, the Svampolin (3rd place 2020, Guthman Musical Instrument Competition, NIME 2019 Best Presentation).  She is also a founding member of Bela.io.  She holds 4 degrees from MIT and completed a PhD at Queen Mary University of London with Dr. Andrew McPherson with follow-on research positions using technology to study the learning of musical instruments at Aarlborg University Copenhagen, and the Sonic Arts Research Centre, Queens University Belfast.  Having previously worked as a ProTools software engineer, she is now a programmer for Ableton Live.  Dr. Pardue is also an active violinist having appeared at major festivals in Western Europe, NY, SF, live on BBC Radios 3,4, & 6, and German television with various artists including Sam Lee, Mishaped Pearls, Bang on a Can, and, as Bitchlovsky, playing semi-improvised violin with live electronic music.  She is currently the head of the [NIME diversity and inclusion committee](https://diversity.nime.org/).

![Dr. Laurel S. Pardue]({{'/assets/keynote/Laurel.png' | relative_url}})

## WiMIR Meet-Up Sessions

This year there are four WiMIR Meet-Up Sessions. Each one is an informal, Q&A-type drop-in event, akin to an "office hour", lasting about 45 minutes. In each session, participants will have the opportunity to talk with a notable woman in the field.

The special guests for each session are:
- 18:30 PST Nov 9: [Cheng-Zhi Anna Huang](https://research.google/people/105787/); Research Scientist / Adjunct Professor; Magenta / Google Brain / Université de Montréal / Mila
- 06:30 PST Nov 10: [Emma Azelborn](https://emmaazelborn.com/); Senior Software Engineer; iZotope, Inc.
- 18:30 PST Nov 10: [Xiao Hu](https://web.edu.hku.hk/faculty-academics/xiaoxhu); Associate Professor; The University of Hong Kong
- 06:30 PST Nov 11: [Katerina Kosta](http://www.katerinakosta.com); Senior Machine Learning Researcher; ByteDance / TikTok

Each session will be an informal Q&A-type drop-in event akin to an "office hour" lasting about 45 minutes. In each session, participants will have the opportunity to talk with a notable woman in the field.


## WiMIR Sponsors

We are very grateful for the generosity of our 2021 sponsors. Their sponsorship has made possible all the [Financial Support](https://ismir2021.ismir.net/financialsupport/) provided to ISMIR attendees, including grants to cover registration fees, paper publication fees, and childcare.

{% for tier in site.data.wimir_sponsors %}   
<div class="row">
<div class="sponsor_tier_pill"> 
<h3 class="tier__name tier__{{ tier.Name }}"> {{ tier.Name }} Sponsors </h3>                    
</div>        
{% for sponsor in tier.Sponsors %}    
{% if tier.Name == "Patron" %}
<div class="col-lg-6 sponsor_logo_box">
{% elsif tier.Name == "Contributor" %}
<div class="col-lg-6 sponsor_logo_box">
{% else %}
<div class="col-lg-4 sponsor_logo_box">
{% endif %}
<a class="sponsor__url" href="{{ sponsor.url }}">  
<img class="sponsor__logo {{ tier.Name }}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="background-image: url({{ sponsor.logo | relative_url }})" />
</a>
</div>
{% endfor %}
</div>
{% endfor %}
