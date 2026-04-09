export const menuItems = [
  { key: 'overview', icon: 'home', label: 'Overview', navigable: true, path: '/overview' },
  { key: 'inbox', icon: 'user', label: 'Inbox', navigable: true, path: '/inbox' },
  { key: 'settings', icon: 'settings', label: 'Settings', navigable: true, path: '/settings' },
  {
    key: 'your-product',
    icon: 'box',
    label: 'Your Product',
    navigable: true,
    path: '/your-product',
  },
  { key: 'my-plan', icon: 'star', label: 'My Plan', navigable: true, path: '/my-plan' },
  { key: 'billing', icon: 'box', label: 'Billing', navigable: true, path: '/billing' },
  { key: 'blocked', icon: 'ban', label: 'Blocked', badge: 'PRO' },
  { key: 'trash', icon: 'trash', label: 'Trash' },
]

export const contacts = [
  {
    name: 'Aspen Workman',
    phone: '(1) 234-543-4321',
    preview: 'Hello! I am looking for a new p...',
    time: '11:28',
    colors: ['#6a4af8', '#8ed5ff'],
    active: true,
  },
  {
    name: 'Rhiel Madsen',
    phone: '(1) 234-543-4321',
    preview: 'Typing...',
    time: '11:28',
    colors: ['#f59e8f', '#f8d6aa'],
  },
  {
    name: 'Carla Dokidis',
    phone: '(1) 234-543-4321',
    preview: 'It works for me! Thanks',
    time: '11:28',
    colors: ['#7388f8', '#aac6ff'],
  },
  {
    name: 'Maria Vetrovs',
    phone: '(1) 234-543-4321',
    preview: "Let's stay in touch!",
    time: '11:28',
    colors: ['#54b4a9', '#9ce6df'],
  },
  {
    name: 'Mary Franci',
    phone: '(1) 234-543-4321',
    preview: 'Thanks. I will watch it later...',
    time: '11:28',
    colors: ['#d58f4e', '#f3d29f'],
  },
  {
    name: 'Omar Vetrovs',
    phone: '(1) 234-543-4321',
    preview: 'Voice message',
    time: '11:28',
    colors: ['#6f88ee', '#a7b8ff'],
  },
  {
    name: 'Marcus Bergson',
    phone: '(1) 234-543-4321',
    preview: 'Hello! I am looking for a new p...',
    time: '11:28',
    colors: ['#8bb6f7', '#c6dbff'],
  },
]

export const messages = [
  {
    side: 'left',
    name: 'Mary Franci',
    time: '12:38',
    text: 'Can I try the software first?',
    colors: ['#d58f4e', '#f3d29f'],
  },
  {
    side: 'right',
    time: '12:38',
    text: 'Sure. Here is the demo unit. You can use it as long as you want.',
    meta: 'via SMS',
  },
  {
    side: 'left',
    name: 'Mary Franci',
    time: '12:38',
    text: 'Thank you. Now I want to buy the software. Which type of subscription do you have?',
    colors: ['#d58f4e', '#f3d29f'],
  },
  {
    side: 'right',
    time: '12:38',
    text: 'We have many type of subscription in this presentation. Please look at this showcase.',
    file: { name: 'Presentation.pdf', size: '2.8 mb' },
  },
  {
    side: 'left',
    name: 'Mary Franci',
    time: '12:38',
    text: 'Thanks. I will watch it later!',
    colors: ['#d58f4e', '#f3d29f'],
  },
]

export const noteRows = [
  'Eget pulvinar blandit tellus suspendisse augue sem lectus varius. Suspendisse in imperdiet adipiscing.',
  'Eget pulvinar blandit tellus suspendisse.',
]

export const accordionRows = ['Additional Info', 'Shared Files', 'Shared Links', 'Documentations']

export const overviewStats = [
  {
    title: 'Total Conversations',
    value: '2,481',
    change: '+12.4%',
    trend: 'up',
    icon: 'chat',
  },
  {
    title: 'Inbox Resolved',
    value: '1,924',
    change: '+8.1%',
    trend: 'up',
    icon: 'checkCircle',
  },
  {
    title: 'Avg. Reply Time',
    value: '2m 14s',
    change: '-11.2%',
    trend: 'down',
    icon: 'timer',
  },
  {
    title: 'Customer Rating',
    value: '4.8/5',
    change: '+0.3',
    trend: 'up',
    icon: 'star',
  },
]

export const overviewSeries = [58, 72, 67, 81, 76, 88, 92]

export const overviewDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const overviewActivity = [
  {
    title: 'New ticket assigned to Inbox',
    meta: '2 minutes ago',
    status: 'High',
  },
  {
    title: 'Follow-up message from Mary Franci',
    meta: '8 minutes ago',
    status: 'Open',
  },
  {
    title: 'Template response used in Live Chat',
    meta: '21 minutes ago',
    status: 'Done',
  },
  {
    title: 'Blocked user moved to review queue',
    meta: '42 minutes ago',
    status: 'Review',
  },
]

export const settingsRows = [
  {
    id: 'ins-1',
    text: 'Always verify customer identity before sharing account information.',
    updatedAt: 'Today, 10:22 AM',
  },
  {
    id: 'ins-2',
    text: 'If issue remains unresolved in 10 minutes, escalate to Tier-2 support.',
    updatedAt: 'Today, 11:08 AM',
  },
  {
    id: 'ins-3',
    text: 'For billing questions, include invoice link and next due date in response.',
    updatedAt: 'Today, 12:41 PM',
  },
]

export const initialProducts = [
  {
    id: 'prd-1',
    image: '',
    name: 'Replizz CRM Suite',
    description: 'Cloud-based customer relationship module with automated tagging.',
    price: '189',
    additionalComment: 'Best for support teams with 5+ agents.',
    discount: '10',
    availability: 'available',
    customInstruction: 'When recommending, mention yearly plan savings first.',
    savedAt: 'Today, 9:34 AM',
  },
]

export const planPackages = [
  {
    id: 'plan-starter',
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Best for solo creators starting out with customer chat workflows.',
    features: ['1 Facebook Page', '500 Conversations', 'Basic Inbox Analytics'],
  },
  {
    id: 'plan-growth',
    name: 'Growth',
    price: 79,
    period: 'month',
    description: 'Good for small teams handling multiple products and campaigns.',
    features: ['3 Facebook Pages', '5,000 Conversations', 'Automation + Saved Replies'],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    price: 149,
    period: 'month',
    description: 'For scaling support teams that need performance and SLA tracking.',
    features: ['10 Facebook Pages', '20,000 Conversations', 'Advanced Analytics'],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 299,
    period: 'month',
    description: 'Custom setup for large organizations and multi-brand operations.',
    features: ['Unlimited Pages', 'Priority Support', 'Custom Integrations'],
  },
]
