---
slug: getting-started-with-jennapress-and-prompts
title: Πώς να φτιάξεις ένα JennaPress site με GitHub Fork + AI Prompt
summary: Ακόμα κι αν δεν έχεις καμία εμπειρία προγραμματισμού, μπορείς να χτίσεις και να συντηρήσεις ένα πλήρες πολυγλωσσικό website με JennaPress, GitHub και ChatGPT.
publishedAt: "2026-04-01"
category: Usage
tags:
  - jennapress
  - getting-started
  - ai-prompt
  - github
author:
  name: Jenna Press
seo:
  title: Πώς να φτιάξεις ένα JennaPress site με GitHub Fork + AI Prompt | Jenna Press
  description: Με JennaPress, GitHub και ChatGPT μπορείς να φτιάξεις ένα πολυγλωσσικό website χωρίς καμία εμπειρία προγραμματισμού.
  canonical: https://www.example.com/blog/usage/getting-started-with-jennapress-and-prompts
bodyTitle: Χτίσε το website σου δέκα φορές πιο γρήγορα με AI
bodyBlocks:
  - type: cta-banner
    title: Δες τα αρχεία Prompt
    description: Τα TEMPLATE_PROMPT και CONTENT_PROMPT είναι τα κεντρικά εργαλεία αυτής της ροής εργασίας.
    action:
      label: Δες στο GitHub
      to: https://github.com/zanghongtu2006/JennaPress
---
Το JennaPress σχεδιάστηκε για να μπορούν και μη τεχνικοί χρήστες να αποκτήσουν γρήγορα ένα επαγγελματικό πολυγλωσσικό website. Σε συνδυασμό με το GitHub Fork και εργαλεία AI, όλη η διαδικασία μπορεί να ολοκληρωθεί σε περίπου τριάντα λεπτά.

## Τι χρειάζεσαι

- Έναν λογαριασμό GitHub (δωρεάν)
- ChatGPT ή κάποιο παρόμοιο AI εργαλείο
- Περίπου 30 λεπτά ελεύθερο χρόνο

Χωρίς γνώσεις προγραμματισμού. Χωρίς εγκατάσταση Node.js. Χωρίς γραμμή εντολών Git.

## Βήμα 1: Κάνε Fork το project

Άνοιξε το JennaPress GitHub repository και πάτα το κουμπί **Fork** πάνω δεξιά. Αυτό αντιγράφει ολόκληρο το repository στον δικό σου λογαριασμό GitHub.

## Βήμα 2: Βρες τα δύο πιο σημαντικά αρχεία

Στον root φάκελο του forked repository θα βρεις:

**CONTENT_PROMPT_EL.md** — Λέει στην AI πώς να γράφει περιεχόμενο: δομή σελίδων, πώς να γράφει άρθρα blog, πώς να χειρίζεται πολυγλωσσικό περιεχόμενο και πώς να συμπληρώνει τα πεδία SEO.

**TEMPLATE_PROMPT_EL.md** — Λέει στην AI πώς να παράγει και να τροποποιεί templates: πώς οργανώνονται τα αρχεία, πώς να γράφει το Header component και πώς λειτουργεί το CSS θεμάτων.

## Βήμα 3: Παράγε περιεχόμενο με AI

Άνοιξε το ChatGPT και στείλε την εξής οδηγία:

> Είσαι ειδικός περιεχομένου JennaPress CMS. Ξεκίνα κάθε απάντηση γράφοντας το περιεχόμενο του CONTENT_PROMPT_EL.md και ακολούθησέ το πιστά.

Στη συνέχεια περιέγραψε τι χρειάζεσαι. Η AI θα παράγει περιεχόμενο σύμφωνα με τους κανόνες. Απλά αντέγραψε το αποτέλεσμα στο αντίστοιχο αρχείο Markdown.

## Βήμα 4: Αυτόματο build και deploy

Το GitHub Actions εντοπίζει τις αλλαγές αυτόματα. Μετά το commit, το GitHub θα κάνει build και deploy το site σου σε λίγα λεπτά.

## Φιλοσοφία JennaPress

Οι δημιουργοί περιεχομένου επικεντρώνονται στο περιεχόμενο, το σύστημα και η AI αναλαμβάνουν τα υπόλοιπα.
