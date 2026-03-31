---
slug: generated-files-and-source-of-truth
title: Generated files και πηγή αλήθειας
summary: Πώς το Jenna Press αντιμετωπίζει τα generated files και γιατί το markdown περιεχόμενο παραμένει η πηγή αλήθειας.
publishedAt: "2026-03-18"
category: Project
tags:
  - jenna-press
  - project
author:
  name: Jenna Press
seo:
  title: Generated files και πηγή αλήθειας | Jenna Press
  description: Κατανοήστε γιατί υπάρχουν generated files και πώς να τα χειρίζεστε με ασφάλεια.
  canonical: https://www.jennapress.com/blog/project/generated-files-and-source-of-truth/
bodyTitle: Το generated επιτρέπεται, αλλά δεν είναι επεξεργάσιμη αλήθεια
bodyBlocks:
  - type: cta-banner
    title: Συνεχίστε να διαβάζετε μέσα στο Jenna Press
    description: Χρησιμοποιήστε τις κατηγορίες του blog για να μετακινηθείτε ανάμεσα στο υπόβαθρο του έργου και στην πρακτική καθοδήγηση χρήσης.
    action:
      label: Επιστροφή στο blog
      to: /el/blog
---
Ένα generated file μπορεί να υπάρχει στο Jenna Press επειδή η static publishing εξακολουθεί να χρειάζεται μια πρακτική γέφυρα ανάμεσα στο source content και στο runtime rendering. Αυτό δεν σημαίνει ότι το generated file είναι το μέρος όπου πρέπει να εργάζονται οι συντάκτες.

Η πηγή αλήθειας παραμένει το markdown περιεχόμενο και η generation logic που το μετασχηματίζει. Το generated output μπορεί να γίνεται commit για λόγους ευκολίας, αλλά πρέπει να αντιμετωπίζεται ως output, να ελέγχεται ως output και να αναδημιουργείται όταν αλλάζει η πραγματική πηγή.

Αυτή η διάκριση έχει σημασία επειδή προστατεύει τόσο τη σαφήνεια της συγγραφής όσο και τη σαφήνεια του code review.
