import { database } from './database'
import { OrganizationModel } from './models/Organization'
import { PostModel } from './models/Post'
import { ContributorModel } from './models/Contributor'
import { CategoryModel } from './models/Category'
import { TagModel } from './models/Tag'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Initialize database
    await database.initialize()
    
    // Clear existing data (if tables exist)
    console.log('🧹 Clearing existing data...')
    try {
      await database.run('DELETE FROM post_tags')
      await database.run('DELETE FROM post_categories')
      await database.run('DELETE FROM posts')
      await database.run('DELETE FROM organizations')
      await database.run('DELETE FROM contributors')
      await database.run('DELETE FROM tags')
      await database.run('DELETE FROM categories')
    } catch (error) {
      // Tables might not exist yet, that's okay
      console.log('📝 Tables not found, will create them...')
    }
    
    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Communities', slug: 'communities', description: 'Community-related content' },
      { name: 'Events', slug: 'events', description: 'Event announcements and information' },
      { name: 'Education', slug: 'education', description: 'Educational content and resources' },
      { name: 'Security', slug: 'security', description: 'Cybersecurity and safety content' },
      { name: 'Technology', slug: 'technology', description: 'Technology-related content' },
      { name: 'Safety', slug: 'safety', description: 'Safety and security information' },
      { name: 'Workshops', slug: 'workshops', description: 'Workshop and training content' }
    ]
    
    const createdCategories = await Promise.all(
      categories.map(cat => CategoryModel.create(cat))
    )
    
    // Create tags
    console.log('🏷️ Creating tags...')
    const tags = [
      { name: 'Mobile Forensics', slug: 'mobile-forensics' },
      { name: 'Community Event', slug: 'community-event' },
      { name: 'Cache Tech Community', slug: 'cache-tech-community' },
      { name: 'Cyber Security', slug: 'cyber-security' },
      { name: 'Tech', slug: 'tech' },
      { name: 'Discord', slug: 'discord' },
      { name: 'Community Engagement', slug: 'community-engagement' },
      { name: 'Networking', slug: 'networking' },
      { name: 'IT STEM', slug: 'it-stem' },
      { name: 'Summer Camp', slug: 'summer-camp' },
      { name: 'Education', slug: 'education' },
      { name: 'Scams', slug: 'scams' },
      { name: 'Online Safety', slug: 'online-safety' },
      { name: 'Personal Security', slug: 'personal-security' },
      { name: 'Privacy', slug: 'privacy' },
      { name: 'MVT', slug: 'mvt' },
      { name: 'Android', slug: 'android' },
      { name: 'iOS', slug: 'ios' }
    ]
    
    const createdTags = await Promise.all(
      tags.map(tag => TagModel.create(tag))
    )
    
    // Create organizations
    console.log('🏢 Creating organizations...')
    const organizations = [
      {
        title: 'Cache Valley Communities',
        slug: 'cachevalleycommunities',
        summary: 'A volunteer-led effort helping neighbors in Cache Valley connect, learn, and collaborate through meetups, workshops, and shared resources—linking people with the local groups that already exist.',
        description: 'Cache Valley is full of people doing good work—neighbors, clubs, nonprofits, and small teams with skills to share. What\'s often missing is an easy way to find each other. Cache Valley Communities exists to make those connections simple.\n\nWe\'re a volunteer-run group that creates chances for people to connect, learn, and build together. No memberships, no gatekeeping—just a welcoming space to meet others and swap knowledge.',
        website: 'https://cachevalley.co/',
        date: '2025-02-18',
        private: false
      },
      {
        title: 'DC435',
        slug: 'dc435',
        summary: 'A cybersecurity community focused on education, networking, and professional development in the Cache Valley area.',
        description: 'DC435 is dedicated to advancing cybersecurity knowledge and practices through community engagement, educational events, and professional networking opportunities.',
        website: 'https://dc435.org/',
        date: '2025-01-15',
        private: false
      },
      {
        title: 'WAB Warming Center',
        slug: 'wab-warming-center',
        summary: 'Providing warmth, shelter, and support to those in need during cold weather months in Cache Valley.',
        description: 'The WAB Warming Center provides essential services to community members experiencing homelessness or housing insecurity during the winter months.',
        website: 'https://wabwarmingcenter.org/',
        date: '2025-01-10',
        private: false
      }
    ]
    
    const createdOrganizations = await Promise.all(
      organizations.map(org => OrganizationModel.create(org))
    )
    
    // Create contributors
    console.log('👥 Creating contributors...')
    const contributors = [
      {
        name: 'John Doe',
        role: 'Community Organizer',
        bio: 'Passionate about building connections in Cache Valley and helping organizations collaborate effectively.',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe'
      },
      {
        name: 'Jane Smith',
        role: 'Technical Lead',
        bio: 'Cybersecurity professional with expertise in mobile forensics and community education.',
        github: 'https://github.com/janesmith',
        linkedin: 'https://linkedin.com/in/janesmith'
      },
      {
        name: 'Mike Johnson',
        role: 'Event Coordinator',
        bio: 'Organizes tech meetups and workshops, helping bring the community together through shared learning experiences.',
        twitter: 'https://twitter.com/mikejohnson'
      }
    ]
    
    const createdContributors = await Promise.all(
      contributors.map(contributor => ContributorModel.create(contributor))
    )
    
    // Create posts
    console.log('📝 Creating posts...')
    const posts = [
      {
        title: 'Cache Tech Community Meetup - January 2025',
        slug: 'cache-tech-meetup-january-2025',
        summary: 'Join us on Jan 25, 2025, at 1:30 PM (MST) at Logan Library for a tech meetup! The event features an open discussion on tech careers and a deep dive into mobile forensics, including an iPhone forensic demo. Open to all skill levels—come learn and connect!',
        content: 'Join our Discord community to stay connected with fellow tech enthusiasts!\n\nJoin us on Jan 25, 2025, at 1:30 PM (MST) at Logan Library for a tech meetup! The event features an open discussion on tech careers and a deep dive into mobile forensics, including an iPhone forensic demo. Open to all skill levels—come learn and connect!\n\n## Event Details:\n- **Date**: Saturday, January 25, 2025\n- **Time**: 1:30 PM – 2:45 PM (MST)\n- **Location**: Community Room A, Logan Library\n\nWe\'ve got an exciting new format this month! Here\'s what you can expect:\n\n## Part 1: General Meetup (45 minutes)\n\nWe\'ll kick things off with an open discussion on navigating the tech world. Whether you\'re pursuing formal education, self-learning, or growing through community-driven opportunities, we\'d love to hear your story! This is your chance to share experiences, exchange ideas, and explore potential mentorship opportunities.\n\n**All skill levels and ages are welcome—there\'s something for everyone!**\n\n## Part 2: Technical Deep Dive (45 minutes)\n\nIn the second half, we\'ll dive into the fascinating world of **mobile forensics**! We\'ll host a live demonstration on performing forensic analysis of an iPhone using the **Mobile Verification Toolkit (MVT)**, a powerful tool for identifying spyware and malware.\n\n**Key highlights include:**\n- Creating and decrypting local backups of iOS devices.\n- Scanning backups for signs of spyware or malicious software.\n- Analyzing common attack vectors for mobile devices.\n- A live demo showcasing how an iPhone can be compromised in under 30 minutes.\n- Discussion on mobile malware detection and mitigation strategies for iOS and Android.\n- Examining the security risks posed by the environment-sensing features of mobile devices.\n\n## Who Should Attend?\n\nThis event is open to everyone—no exceptions! Whether you\'re a beginner, self-taught, or an experienced tech professional, there\'s something here for you.\n\nBring your curiosity, questions, and enthusiasm—let\'s learn, connect, and grow together!\n\n**Stay tuned for further updates** on the event\'s time and location. We look forward to seeing you there!\n\n---\n\nWe\'re excited for the return of the Cache Tech Community, and we can\'t wait to kick off the year with all of you!',
        date: '2025-01-18',
        image: 'image_870x_67799e80a280c.jpg',
        weight: 1,
        private: false,
        categories: ['Communities', 'Events'],
        tags: ['Mobile Forensics', 'Community Event', 'Cache Tech Community', 'Cyber Security', 'Tech']
      },
      {
        title: 'Why You Should Join Our Discord',
        slug: 'why-you-should-join-our-discord',
        summary: 'Discover the benefits of joining our Discord community and how it can help you connect with fellow tech enthusiasts.',
        content: 'Our Discord community is the heart of Cache Valley Communities. Here\'s why you should join us:\n\n## Real-time Communication\n- Get instant updates about events and meetups\n- Ask questions and get quick responses from the community\n- Share resources and links with others\n\n## Networking Opportunities\n- Connect with professionals in your field\n- Find mentors and mentees\n- Discover collaboration opportunities\n\n## Learning Resources\n- Access to exclusive content and tutorials\n- Discussion channels for different topics\n- Regular Q&A sessions with experts\n\n## Community Support\n- Get help with technical problems\n- Share your projects and get feedback\n- Find study groups and accountability partners\n\nJoin us today and become part of the Cache Valley tech community!',
        date: '2025-01-15',
        weight: 0,
        private: false,
        categories: ['Communities'],
        tags: ['Discord', 'Community Engagement', 'Networking']
      },
      {
        title: 'IT STEM Summer Camp',
        slug: 'it-stem-summer-camp',
        summary: 'Join us for an exciting IT STEM summer camp designed for 9th grade students interested in technology and computer science.',
        content: 'We\'re excited to announce our IT STEM Summer Camp for 9th grade students!\n\n## What You\'ll Learn\n- Introduction to programming concepts\n- Basic computer hardware and software\n- Cybersecurity fundamentals\n- Networking basics\n- Project-based learning\n\n## Program Details\n- **Duration**: 2 weeks\n- **Schedule**: Monday-Friday, 9 AM - 3 PM\n- **Location**: Logan Library Community Room\n- **Cost**: Free (sponsored by Cache Valley Communities)\n\n## Requirements\n- Currently enrolled in 9th grade\n- Interest in technology and computer science\n- No prior programming experience required\n\n## Registration\nSpace is limited! Contact us to reserve your spot.\n\nThis camp is designed to introduce students to the exciting world of information technology and help them explore potential career paths in STEM fields.',
        date: '2025-01-12',
        weight: 0,
        private: false,
        categories: ['Education'],
        tags: ['IT STEM', 'Summer Camp', 'Education', 'Technology']
      },
      {
        title: 'How to Spot and Avoid Scams',
        slug: 'how-to-spot-and-avoid-scams',
        summary: 'Learn essential tips and strategies to protect yourself from common online and offline scams.',
        content: 'In today\'s digital world, scams are becoming increasingly sophisticated. Here\'s how to protect yourself:\n\n## Common Scam Types\n\n### Phishing Emails\n- Look for suspicious sender addresses\n- Check for spelling and grammar errors\n- Never click on suspicious links\n- Verify requests through official channels\n\n### Phone Scams\n- Be wary of unsolicited calls\n- Never give personal information over the phone\n- Hang up on aggressive callers\n- Verify caller identity independently\n\n### Online Shopping Scams\n- Research sellers before purchasing\n- Use secure payment methods\n- Check for secure website indicators (HTTPS)\n- Read reviews and ratings\n\n## Red Flags to Watch For\n- Requests for immediate payment\n- Pressure to act quickly\n- Requests for personal information\n- Offers that seem too good to be true\n- Unsolicited contact from "official" sources\n\n## Protection Strategies\n- Keep software updated\n- Use strong, unique passwords\n- Enable two-factor authentication\n- Be skeptical of unsolicited communications\n- Educate yourself about current scam trends\n\nStay safe and remember: when in doubt, don\'t give it out!',
        date: '2025-01-10',
        weight: 0,
        private: false,
        categories: ['Safety', 'Security'],
        tags: ['Scams', 'Online Safety', 'Personal Security', 'Privacy']
      },
      {
        title: 'Intro to Mobile Forensics',
        slug: 'intro-to-mobile-forensics',
        summary: 'An introduction to mobile forensics techniques and tools for cybersecurity professionals.',
        content: 'Mobile forensics is a crucial skill in today\'s cybersecurity landscape. Here\'s what you need to know:\n\n## What is Mobile Forensics?\nMobile forensics is the process of recovering digital evidence from mobile devices in a forensically sound manner. This includes smartphones, tablets, and other mobile devices.\n\n## Key Concepts\n\n### Chain of Custody\n- Document every step of the process\n- Maintain detailed records\n- Ensure evidence integrity\n- Follow legal requirements\n\n### Data Acquisition\n- Physical acquisition (direct device access)\n- Logical acquisition (file system access)\n- File system acquisition (partition access)\n- Manual extraction (user-accessible data)\n\n## Popular Tools\n\n### Mobile Verification Toolkit (MVT)\n- Open-source tool for iOS and Android\n- Detects spyware and malware\n- Analyzes device backups\n- Provides detailed reporting\n\n### Cellebrite UFED\n- Commercial forensic solution\n- Supports multiple device types\n- Advanced data recovery capabilities\n- Legal-grade reporting\n\n### Oxygen Forensic Suite\n- Comprehensive mobile forensics\n- Cloud data analysis\n- Social media forensics\n- Timeline analysis\n\n## Best Practices\n- Always work with device backups when possible\n- Document all procedures\n- Use write-blocking techniques\n- Maintain evidence integrity\n- Follow legal and ethical guidelines\n\n## Legal Considerations\n- Obtain proper authorization\n- Follow local laws and regulations\n- Maintain chain of custody\n- Prepare for court testimony\n\nMobile forensics is an evolving field that requires continuous learning and adaptation to new technologies and threats.',
        date: '2025-01-08',
        weight: 0,
        private: false,
        categories: ['Security', 'Workshops'],
        tags: ['Mobile Forensics', 'Cyber Security', 'MVT', 'Android', 'iOS']
      }
    ]
    
    // Helper function to find category/tag IDs by name
    const findCategoryId = (name: string) => createdCategories.find(c => c.name === name)?.id
    const findTagId = (name: string) => createdTags.find(t => t.name === name)?.id
    
    for (const postData of posts) {
      const { categories, tags, ...postContent } = postData
      
      const categoryIds = categories.map(findCategoryId).filter(Boolean) as number[]
      const tagIds = tags.map(findTagId).filter(Boolean) as number[]
      
      await PostModel.create(postContent, categoryIds, tagIds)
    }
    
    console.log('✅ Database seeding completed successfully!')
    console.log(`📊 Created:`)
    console.log(`   - ${createdCategories.length} categories`)
    console.log(`   - ${createdTags.length} tags`)
    console.log(`   - ${createdOrganizations.length} organizations`)
    console.log(`   - ${createdContributors.length} contributors`)
    console.log(`   - ${posts.length} posts`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await database.close()
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
