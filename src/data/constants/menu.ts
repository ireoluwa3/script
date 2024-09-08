export const adminMenu: IMenu[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    permission: ["Access Admin Dashboard"],
    icon: "solar:home-angle-line-duotone",
  },
  // crm
  {
    title: "CRM",
    href: "/admin/crm",
    icon: "solar:user-bold-duotone",
    permission: [
      "Access User Management",
      "Access Role Management",
      "Access Permission Management",
      "Access KYC Management",
      "Access KYC Template Management",
      "Access Support Ticket Management",
    ],
    menu: [
      {
        title: "Users",
        icon: "ph:users-duotone",
        href: "/admin/crm/user",
        permission: [
          "Access User Management",
          "Access Role Management",
          "Access Permission Management",
        ],
        subMenu: [
          {
            title: "List",
            href: "/admin/crm/user",
            permission: ["Access User Management"],
            icon: "ph:list-duotone",
          },
          {
            title: "Roles",
            href: "/admin/crm/role",
            permission: ["Access Role Management"],
            icon: "ph:shield-check-duotone",
          },
          {
            title: "Permissions",
            href: "/admin/crm/permission",
            permission: ["Access Permission Management"],
            icon: "ph:key-duotone",
          },
        ],
      },
      {
        title: "KYC",
        icon: "ph:shield-check-duotone",
        subMenu: [
          {
            title: "Applicants",
            href: "/admin/crm/kyc/applicant",
            permission: ["Access KYC Management"],
            icon: "ph:list-duotone",
          },
          {
            title: "Templates",
            href: "/admin/crm/kyc/template",
            permission: ["Access KYC Template Management"],
            icon: "fluent-mdl2:chart-template",
          },
        ],
      },
      {
        title: "Support",
        icon: "ph:lifebuoy-duotone",
        href: "/admin/crm/support/ticket",
        permission: ["Access Support Ticket Management"],
      },
      {
        title: "API",
        icon: "carbon:api",
        href: "/admin/api/key",
        permission: ["Access API Key Management"],
      },
    ],
  },
  // finance
  {
    title: "Finance",
    href: "/admin/finance",
    icon: "solar:dollar-minimalistic-line-duotone",
    permission: [
      "Access Fiat Currency Management",
      "Access Spot Currency Management",
      "Access Deposit Gateway Management",
      "Access Deposit Method Management",
      "Access Exchange Provider Management",
      "Access Investment Plan Management",
      "Access Investment Duration Management",
      "Access Investment Management",
      "Access Binary Order Management",
      "Access Exchange Order Management",
      "Access Ecosystem Order Management",
      "Access Futures Order Management",
      "Access Transaction Management",
      "Access Wallet Management",
      "Access Withdrawal Method Management",
    ],
    menu: [
      {
        title: "Currencies",
        icon: "ph:currency-circle-dollar-duotone",
        permission: [
          "Access Fiat Currency Management",
          "Access Spot Currency Management",
        ],
        subMenu: [
          {
            title: "Fiat",
            href: "/admin/finance/currency/fiat",
            permission: ["Access Fiat Currency Management"],
            icon: "ph:currency-dollar-duotone",
          },
          {
            title: "Spot",
            href: "/admin/finance/currency/spot",
            permission: ["Access Spot Currency Management"],
            icon: "ph:currency-eth-duotone",
          },
        ],
      },
      {
        title: "Deposit",
        icon: "ph:download-simple-duotone",
        permission: [
          "Access Deposit Gateway Management",
          "Access Deposit Method Management",
        ],
        subMenu: [
          {
            title: "Gateways",
            href: "/admin/finance/deposit/gateway",
            permission: ["Access Deposit Gateway Management"],
            icon: "ri:secure-payment-line",
          },
          {
            title: "Methods",
            href: "/admin/finance/deposit/method",
            permission: ["Access Deposit Method Management"],
            icon: "ph:credit-card-duotone",
          },
        ],
      },
      // exchange
      {
        title: "Exchange Providers",
        href: "/admin/finance/exchange",
        icon: "material-symbols-light:component-exchange",
        permission: ["Access Exchange Provider Management"],
      },
      {
        title: "Investments",
        icon: "solar:course-up-line-duotone",
        permission: [
          "Access Investment Plan Management",
          "Access Investment Duration Management",
          "Access Investment Management",
        ],
        subMenu: [
          {
            title: "Plans",
            href: "/admin/finance/investment/plan",
            permission: ["Access Investment Plan Management"],
            icon: "solar:planet-2-bold-duotone",
          },
          {
            title: "Durations",
            href: "/admin/finance/investment/duration",
            permission: ["Access Investment Duration Management"],
            icon: "ph:clock-duotone",
          },
          {
            title: "History",
            href: "/admin/finance/investment/history",
            permission: ["Access Investment Management"],
            icon: "ph:chart-line-duotone",
          },
        ],
      },
      {
        title: "Orders",
        icon: "solar:chart-2-bold-duotone",
        permission: [
          "Access Binary Order Management",
          "Access Exchange Order Management",
          "Access Ecosystem Order Management",
        ],
        subMenu: [
          {
            title: "Binary",
            href: "/admin/finance/order/binary",
            permission: ["Access Binary Order Management"],
            icon: "humbleicons:exchange-vertical",
            env: process.env.NEXT_PUBLIC_BINARY_STATUS,
          },
          {
            title: "Exchange",
            href: "/admin/finance/order/exchange",
            permission: ["Access Exchange Order Management"],
            icon: "bi:currency-exchange",
          },
          {
            title: "Ecosystem",
            href: "/admin/finance/order/ecosystem",
            permission: ["Access Ecosystem Order Management"],
            extension: "ecosystem",
            icon: "mdi:briefcase-exchange-outline",
          },
          {
            title: "Futures",
            href: "/admin/finance/order/futures",
            permission: ["Access Futures Order Management"],
            extension: "futures",
            icon: "mdi:chart-line-variant",
          }
        ],
      },
      {
        title: "Transactions",
        href: "/admin/finance/transaction",
        permission: ["Access Transaction Management"],
        icon: "solar:clipboard-list-bold-duotone",
      },
      {
        title: "Wallets",
        href: "/admin/finance/wallet",
        permission: ["Access Wallet Management"],
        icon: "ph:wallet-duotone",
      },
      {
        title: "Withdrawal Methods",
        href: "/admin/finance/withdraw/method",
        permission: ["Access Withdrawal Method Management"],
        icon: "ph:hand-withdraw-duotone",
      },
    ],
  },
  // content
  {
    title: "Content",
    href: "/admin/content",
    icon: "fluent:content-view-28-regular",
    permission: [
      "Access Author Management",
      "Access Post Management",
      "Access Category Management",
      "Access Tag Management",
      "Access Comment Management",
      "Access Page Management",
      "Access Media Management",
      "Access Slider Management",
    ],
    menu: [
      {
        title: "Authors",
        icon: "ph:users-four-duotone",
        permission: ["Access Author Management"],
        href: "/admin/content/author",
        env: process.env.NEXT_PUBLIC_BLOG_STATUS,
      },
      {
        title: "Posts",
        href: "/admin/content/post",
        permission: ["Access Post Management"],
        icon: "ph:note-pencil-duotone",
        env: process.env.NEXT_PUBLIC_BLOG_STATUS,
      },
      {
        title: "Categories",
        href: "/admin/content/category",
        permission: ["Access Category Management"],
        icon: "ph:folders-duotone",
        env: process.env.NEXT_PUBLIC_BLOG_STATUS,
      },
      {
        title: "Tags",
        href: "/admin/content/tag",
        permission: ["Access Tag Management"],
        icon: "ph:tag-duotone",
        env: process.env.NEXT_PUBLIC_BLOG_STATUS,
      },
      {
        title: "Comments",
        href: "/admin/content/comment",
        permission: ["Access Comment Management"],
        icon: "ph:chat-circle-text-duotone",
        env: process.env.NEXT_PUBLIC_BLOG_STATUS,
      },
      // {
      //   title: "Pages",
      //   icon: "ph:files-duotone",
      //   href: "/admin/content/page",
      //   permission: ["Access Page Management"],
      // },
      {
        title: "Media",
        icon: "ph:image-duotone",
        href: "/admin/content/media",
        permission: ["Access Media Management"],
      },
      {
        title: "Sliders",
        icon: "solar:slider-vertical-bold-duotone",
        href: "/admin/content/slider",
        permission: ["Access Slider Management"],
      },
    ],
  },
  // ext (extensions)
  {
    title: "Extensions",
    href: "/admin/ext",
    icon: "solar:code-scan-bold-duotone",
    permission: [
      "Access Affiliate Condition Management",
      "Access Affiliate Referral Management",
      "Access Affiliate Reward Management",
      "Access AI Investment Investment Management",
      "Access AI Investment Plan Management",
      "Access AI Investment Duration Management",
      "Access Ecommerce Category Management",
      "Access Ecommerce Discount Management",
      "Access Ecommerce Order Management",
      "Access Ecommerce Product Management",
      "Access Ecommerce Review Management",
      "Access Ecommerce Shipping Management",
      "Access Ecommerce Wishlist Management",
      "Access Ecosystem Management",
      "Access Ecosystem Market Management",
      "Access Futures Market Management",
      "Access Ecosystem Token Management",
      "Access Ecosystem UTXO Management",
      "Access Ecosystem Ledger Management",
      "Access Ecosystem Wallet Management",
      "Access FAQ Category Management",
      "Access FAQ Management",
      "Access Forex Account Management",
      "Access Forex Currency Management",
      "Access Forex Duration Management",
      "Access Forex Investment Management",
      "Access Forex Plan Management",
      "Access Forex Signal Management",
      "Access ICO Allocation Management",
      "Access ICO Contribution Management",
      "Access ICO Phase Management",
      "Access ICO Project Management",
      "Access ICO Token Management",
      "Access Mailwizard Campaign Management",
      "Access Mailwizard Template Management",
      "Access P2P Commission Management",
      "Access P2P Dispute Management",
      "Access P2P Escrow Management",
      "Access P2P Offer Management",
      "Access P2P Payment Method Management",
      "Access P2P Review Management",
      "Access P2P Trade Management",
      "Access Staking Duration Management",
      "Access Staking Management",
      "Access Staking Pool Management",
    ],
    menu: [
      {
        title: "Affiliate",
        icon: "ph:handshake-duotone",
        extension: "mlm",
        permission: [
          "Access Affiliate Condition Management",
          "Access Affiliate Referral Management",
          "Access Affiliate Reward Management",
        ],
        subMenu: [
          {
            title: "Conditions",
            href: "/admin/ext/affiliate/condition",
            permission: ["Access Affiliate Condition Management"],
            icon: "carbon:condition-point",
          },
          {
            title: "Referrals",
            href: "/admin/ext/affiliate/referral",
            permission: ["Access Affiliate Referral Management"],
            icon: "lets-icons:send-duotone",
          },
          {
            title: "Rewards",
            href: "/admin/ext/affiliate/reward",
            permission: ["Access Affiliate Reward Management"],
            icon: "material-symbols-light:rewarded-ads-outline-rounded",
          },
        ],
      },
      {
        title: "AI Investment",
        icon: "ph:lightning-duotone",
        extension: "ai_investment",
        permission: [
          "Access AI Investment Investment Management",
          "Access AI Investment Plan Management",
          "Access AI Investment Duration Management",
        ],
        subMenu: [
          {
            title: "Investments",
            href: "/admin/ext/ai/investment/log",
            permission: ["Access AI Investment Investment Management"],
            icon: "ph:chart-line-up-duotone",
          },
          {
            title: "Plans",
            href: "/admin/ext/ai/investment/plan",
            permission: ["Access AI Investment Plan Management"],
            icon: "solar:planet-bold-duotone",
          },
          {
            title: "Durations",
            href: "/admin/ext/ai/investment/duration",
            permission: ["Access AI Investment Duration Management"],
            icon: "ph:hourglass-duotone",
          },
        ],
      },
      // ecommerce
      {
        title: "Ecommerce",
        icon: "ph:shopping-cart-duotone",
        extension: "ecommerce",
        permission: [
          "Access Ecommerce Category Management",
          "Access Ecommerce Discount Management",
          "Access Ecommerce Order Management",
          "Access Ecommerce Product Management",
          "Access Ecommerce Review Management",
          "Access Ecommerce Shipping Management",
          "Access Ecommerce Wishlist Management",
        ],
        subMenu: [
          // category
          {
            title: "Categories",
            href: "/admin/ext/ecommerce/category",
            permission: ["Access Ecommerce Category Management"],
            icon: "ph:list-duotone",
          },
          // product
          {
            title: "Products",
            href: "/admin/ext/ecommerce/product",
            permission: ["Access Ecommerce Product Management"],
            icon: "ph:shopping-bag-duotone",
          },
          // discount
          {
            title: "Discounts",
            href: "/admin/ext/ecommerce/discount",
            permission: ["Access Ecommerce Discount Management"],
            icon: "hugeicons:discount",
          },
          // order
          {
            title: "Orders",
            href: "/admin/ext/ecommerce/order",
            permission: ["Access Ecommerce Order Management"],
            icon: "ph:receipt-duotone",
          },
          // review
          {
            title: "Reviews",
            href: "/admin/ext/ecommerce/review",
            permission: ["Access Ecommerce Review Management"],
            icon: "ph:star-duotone",
          },
          // wishlist
          {
            title: "Wishlist",
            href: "/admin/ext/ecommerce/wishlist",
            permission: ["Access Ecommerce Wishlist Management"],
            icon: "ph:heart-duotone",
          },
          // shipping
          {
            title: "Shipping",
            href: "/admin/ext/ecommerce/shipping",
            permission: ["Access Ecommerce Shipping Management"],
            icon: "ph:truck-duotone",
          },
        ],
      },
      {
        title: "Ecosystem",
        icon: "ph:globe-duotone",
        extension: "ecosystem",
        permission: [
          "Access Ecosystem Management",
          "Access Ecosystem Market Management",
          "Access Ecosystem Token Management",
          "Access Ecosystem UTXO Management",
          "Access Ecosystem Ledger Management",
          "Access Ecosystem Wallet Management",
        ],
        subMenu: [
          // blockchains
          {
            title: "Blockchains",
            href: "/admin/ext/ecosystem",
            permission: ["Access Ecosystem Management"],
            icon: "hugeicons:blockchain-02",
          },
          // master wallet
          {
            title: "Master Wallets",
            href: "/admin/ext/ecosystem/wallet/master",
            permission: ["Access Ecosystem Wallet Management"],
            icon: "ph:wallet-duotone",
          },
          // custodial wallet
          {
            title: "Custodial Wallets",
            href: "/admin/ext/ecosystem/wallet/custodial",
            permission: ["Access Ecosystem Wallet Management"],
            icon: "ph:wallet-duotone",
          },
          // market
          {
            title: "Markets",
            href: "/admin/ext/ecosystem/market",
            permission: ["Access Ecosystem Market Management"],
            icon: "ri:exchange-2-line",
          },
          // token
          {
            title: "Tokens",
            href: "/admin/ext/ecosystem/token",
            permission: ["Access Ecosystem Token Management"],
            icon: "ph:coin-duotone",
          },
          // utxo
          {
            title: "UTXOs",
            href: "/admin/ext/ecosystem/utxo",
            permission: ["Access Ecosystem UTXO Management"],
            icon: "carbon:cics-transaction-server-zos",
          },
          // ledger
          {
            title: "Ledgers",
            href: "/admin/ext/ecosystem/ledger",
            permission: ["Access Ecosystem Ledger Management"],
            icon: "ph:books-duotone",
          },
        ],
      },
      // faq
      {
        title: "FAQ",
        icon: "ph:question-duotone",
        extension: "knowledge_base",
        permission: ["Access FAQ Category Management", "Access FAQ Management"],
        subMenu: [
          {
            title: "Categories",
            href: "/admin/ext/faq/category",
            permission: ["Access FAQ Category Management"],
            icon: "ph:list-duotone",
          },
          {
            title: "Questions",
            href: "/admin/ext/faq/question",
            permission: ["Access FAQ Management"],
            icon: "ph:question-light",
          },
        ],
      },
      // forex
      {
        title: "Forex",
        icon: "ph:currency-dollar-simple-duotone",
        extension: "forex",
        permission: [
          "Access Forex Account Management",
          "Access Forex Currency Management",
          "Access Forex Duration Management",
          "Access Forex Investment Management",
          "Access Forex Plan Management",
          "Access Forex Signal Management",
        ],
        subMenu: [
          // account
          {
            title: "Accounts",
            href: "/admin/ext/forex/account",
            permission: ["Access Forex Account Management"],
            icon: "mdi:badge-account-outline",
          },
          // plan
          {
            title: "Plans",
            href: "/admin/ext/forex/plan",
            permission: ["Access Forex Plan Management"],
            icon: "solar:planet-bold-duotone",
          },
          // duration
          {
            title: "Durations",
            href: "/admin/ext/forex/duration",
            permission: ["Access Forex Duration Management"],
            icon: "ph:clock-duotone",
          },
          // investment
          {
            title: "Investments",
            href: "/admin/ext/forex/investment",
            permission: ["Access Forex Investment Management"],
            icon: "ph:chart-line-duotone",
          },
          // signal
          {
            title: "Signals",
            href: "/admin/ext/forex/signal",
            permission: ["Access Forex Signal Management"],
            icon: "mynaui:signal",
          },
        ],
      },
      //futures
      {
        title: "Futures",
        icon: "ph:chart-line-duotone",
        extension: "futures",
        permission: ["Access Futures Market Management"],
        subMenu: [
          {
            title: "Markets",
            href: "/admin/ext/futures/market",
            permission: ["Access Futures Market Management"],
            icon: "ri:exchange-2-line",
          },
          {
            title: "Positions",
            href: "/admin/ext/futures/position",
            permission: ["Access Futures Position Management"],
            icon: "humbleicons:exchange-vertical",
          },
        ],
      },
      // ico
      {
        title: "ICO",
        icon: "hugeicons:ico",
        extension: "ico",
        permission: [
          "Access ICO Allocation Management",
          "Access ICO Contribution Management",
          "Access ICO Phase Management",
          "Access ICO Project Management",
          "Access ICO Token Management",
        ],
        subMenu: [
          // project
          {
            title: "Projects",
            href: "/admin/ext/ico/project",
            permission: ["Access ICO Project Management"],
            icon: "ph:rocket-duotone",
          },
          // token
          {
            title: "Tokens",
            href: "/admin/ext/ico/token",
            permission: ["Access ICO Token Management"],
            icon: "ph:coin-duotone",
          },
          // phase
          {
            title: "Phases",
            href: "/admin/ext/ico/phase",
            permission: ["Access ICO Phase Management"],
            icon: "ph:flag-checkered-duotone",
          },
          // allocation
          {
            title: "Allocations",
            href: "/admin/ext/ico/allocation",
            permission: ["Access ICO Allocation Management"],
            icon: "subway:part-of-circle-5",
          },
          // contribution
          {
            title: "Contributions",
            href: "/admin/ext/ico/contribution",
            permission: ["Access ICO Contribution Management"],
            icon: "icon-park-outline:add-two",
          },
        ],
      },
      // mailwizard
      {
        title: "Mail Wizard",
        icon: "ph:envelope-duotone",
        extension: "mailwizard",
        permission: [
          "Access Mailwizard Campaign Management",
          "Access Mailwizard Template Management",
        ],
        subMenu: [
          // campaign
          {
            title: "Campaigns",
            href: "/admin/ext/mailwizard/campaign",
            permission: ["Access Mailwizard Campaign Management"],
            icon: "ph:megaphone-duotone",
          },
          // template
          {
            title: "Templates",
            href: "/admin/ext/mailwizard/template",
            permission: ["Access Mailwizard Template Management"],
            icon: "fluent-mdl2:chart-template",
          },
        ],
      },
      // p2p
      {
        title: "P2P",
        icon: "ph:users-four-duotone",
        extension: "p2p",
        permission: [
          "Access P2P Commission Management",
          "Access P2P Dispute Management",
          "Access P2P Escrow Management",
          "Access P2P Offer Management",
          "Access P2P Payment Method Management",
          "Access P2P Review Management",
          "Access P2P Trade Management",
        ],
        subMenu: [
          // payment method
          {
            title: "Payment Methods",
            href: "/admin/ext/p2p/payment/method",
            permission: ["Access P2P Payment Method Management"],
            icon: "ph:credit-card-duotone",
          },
          // offer
          {
            title: "Offers",
            href: "/admin/ext/p2p/offer",
            permission: ["Access P2P Offer Management"],
            icon: "ph:tag-duotone",
          },
          // trade
          {
            title: "Trades",
            href: "/admin/ext/p2p/trade",
            permission: ["Access P2P Trade Management"],
            icon: "ph:shopping-cart-duotone",
          },
          // dispute
          {
            title: "Disputes",
            href: "/admin/ext/p2p/dispute",
            permission: ["Access P2P Dispute Management"],
            icon: "material-symbols-light:fmd-bad-outline-rounded",
          },
          // escrow
          {
            title: "Escrows",
            href: "/admin/ext/p2p/escrow",
            permission: ["Access P2P Escrow Management"],
            icon: "fluent:people-money-20-regular",
          },
          // commission
          {
            title: "Commissions",
            href: "/admin/ext/p2p/commission",
            permission: ["Access P2P Commission Management"],
            icon: "ph:currency-circle-dollar-duotone",
          },
          // review
          {
            title: "Reviews",
            href: "/admin/ext/p2p/review",
            permission: ["Access P2P Review Management"],
            icon: "ph:star-duotone",
          },
        ],
      },
      // staking
      {
        title: "Staking",
        icon: "ph:stack-duotone",
        extension: "staking",
        permission: [
          "Access Staking Duration Management",
          "Access Staking Management",
          "Access Staking Pool Management",
        ],
        subMenu: [
          // pool
          {
            title: "Pools",
            href: "/admin/ext/staking/pool",
            permission: ["Access Staking Pool Management"],
            icon: "ph:stack-duotone",
          },
          // duration
          {
            title: "Durations",
            href: "/admin/ext/staking/duration",
            permission: ["Access Staking Duration Management"],
            icon: "ph:hourglass-duotone",
          },
          // log
          {
            title: "Logs",
            href: "/admin/ext/staking/log",
            permission: ["Access Staking Management"],
            icon: "ph:note-duotone",
          },
        ],
      },
    ],
  },
  // system
  {
    title: "System",
    href: "/admin/system",
    icon: "mdi:cog",
    permission: [
      "Access Announcement Management",
      "Access Cron Job Management",
      "Access Database Backup Management",
      "Access Database Migration Management",
      "Access Extension Management",
      "Access Log Monitor",
      "Access Notification Template Management",
      "Access System Settings Management",
      "Access System Update Management",
    ],
    menu: [
      // setting
      {
        title: "Settings",
        href: "/admin/system/settings",
        icon: "ph:sliders-duotone",
        permission: ["Access System Settings Management"],
      },
      // update
      {
        title: "Updates",
        href: "/admin/system/update",
        icon: "ph:arrow-clockwise-duotone",
        permission: ["Access System Update Management"],
      },
      // extension
      {
        title: "Extensions",
        href: "/admin/system/extension",
        icon: "ph:puzzle-piece-duotone",
        permission: ["Access Extension Management"],
      },
      {
        title: "Notification Templates",
        icon: "ph:envelope-simple-duotone",
        href: "/admin/system/notification/template",
        permission: ["Access Notification Template Management"],
      },
      // announcements
      {
        title: "Announcements",
        href: "/admin/system/announcement",
        permission: ["Access Announcement Management"],
        icon: "ph:megaphone-duotone",
      },
      // log
      {
        title: "Logs",
        href: "/admin/system/log",
        icon: "ph:note-duotone",
        permission: ["Access Log Monitor"],
      },
      // cron
      {
        title: "Cron Jobs",
        href: "/admin/system/cron",
        permission: ["Access Cron Job Management"],
        icon: "ph:clock-duotone",
      },
      // database
      {
        title: "Database",
        href: "/admin/system/database",
        icon: "ph:database-duotone",
        permission: [
          "Access Database Backup Management",
          "Access Database Migration Management",
        ],
        subMenu: [
          {
            title: "Backups",
            href: "/admin/system/database/backup",
            permission: ["Access Database Backup Management"],
            icon: "solar:cloud-download-outline",
          },
          {
            title: "Migration Tool",
            href: "/admin/system/database/migration",
            permission: ["Access Database Migration Management"],
            icon: "ph:upload-duotone",
          },
        ],
      },
    ],
  },
  // theme
  {
    title: "Theme",
    href: "/admin/theme",
    icon: "solar:palette-bold-duotone",
    permission: ["Access Frontend Builder"],
  },
];

export const userMenu: IMenu[] = [
  {
    title: "Trade",
    href: "/trade",
    icon: "solar:chart-2-bold-duotone",
    isMegaMenu: true,
    menu: [
      {
        title: "Spot Trading",
        href: "/market",
        icon: "solar:chart-2-bold-duotone",
        description: "View the latest market data.",
      },
      {
        title: "Futures Trading",
        href: "/futures",
        icon: "solar:chart-bold-duotone",
        extension: "futures",
        description: "Trade futures contracts.",
      },
      {
        title: "Forex Trading",
        href: "/user/forex",
        icon: "mdi:chart-line-variant",
        extension: "forex",
        description: "Trade forex with meta trader 4 and 5.",
        subMenu: [
          {
            title: "Accounts",
            href: "/user/forex",
            icon: "mdi:wallet-outline",
          },
          {
            title: "Investment Plans",
            href: "/user/invest/forex/plan",
            icon: "mdi:finance",
            settings: ["forexInvestment"],
          },
          {
            title: "Investments",
            href: "/user/invest/forex",
            icon: "mdi:currency-usd",
            settings: ["forexInvestment"],
          },
        ],
      },
      {
        title: "Binary Trading",
        href: "/user/binary",
        icon: "mdi:chart-line",
        env: process.env.NEXT_PUBLIC_BINARY_STATUS,
        description: "Trade binary options with advanced tools.",
      },
    ],
  },
  {
    title: "Account",
    href: "/user",
    icon: "solar:user-id-line-duotone",
    auth: true,
    menu: [
      {
        title: "Wallet",
        href: "/user/wallet",
        icon: "mdi:wallet",
        auth: true,
        description: "Manage your wallet.",
      },
      {
        title: "Affiliate",
        href: "/user/affiliate",
        icon: "mdi:handshake-outline",
        extension: "mlm",
        description: "Earn money by referring friends.",
        subMenu: [
          {
            title: "Network",
            href: "/user/affiliate",
            icon: "mdi:network",
          },
          {
            title: "Referrals",
            href: "/user/affiliate/referral",
            icon: "mdi:account-group-outline",
          },
          {
            title: "Rewards",
            href: "/user/affiliate/reward",
            icon: "mdi:gift-outline",
          },
          {
            title: "Affiliate Program",
            href: "/user/affiliate/program",
            icon: "mdi:badge-account-outline",
          },
        ],
      },
      {
        title: "Initial Coin Offering",
        href: "/user/ico",
        icon: "mdi:coin-outline",
        extension: "ico",
        description: "Invest in ICO projects.",
      },
      {
        title: "Invest",
        href: "/user/invest",
        icon: "mdi:finance",
        settings: ["investment"],
        subMenu: [
          {
            title: "Investment Plans",
            href: "/user/invest/general/plan",
            icon: "mdi:finance",
          },
          {
            title: "Investments",
            href: "/user/invest/general",
            icon: "mdi:wallet-outline",
          },
        ],
      },
      {
        title: "P2P",
        href: "/user/p2p",
        icon: "material-symbols-light:p2p-outline",
        extension: "p2p",
        description: "Trade cryptocurrency with other users.",
        subMenu: [
          {
            title: "Offers",
            href: "/user/p2p",
            icon: "mdi:tag-outline",
          },
          {
            title: "Trades",
            href: "/user/p2p/trade",
            icon: "material-symbols-light:p2p-outline",
          },
          {
            title: "Payment Methods",
            href: "/user/p2p/paymentMethod",
            icon: "mdi:credit-card-outline",
          },
        ],
      },
      {
        title: "Staking",
        href: "/user/staking",
        icon: "mdi:bank-outline",
        extension: "staking",
        description: "Stake your coins and earn rewards.",
        subMenu: [
          {
            title: "Pools",
            href: "/user/staking",
            icon: "mdi:pool",
          },
          {
            title: "Stakes",
            href: "/user/staking/history",
            icon: "mdi:history",
          },
        ],
      },
      {
        title: "Store",
        href: "/user/store",
        icon: "solar:bag-smile-bold-duotone",
        extension: "ecommerce",
        description: "Buy products from our store.",
        subMenu: [
          {
            title: "Orders",
            href: "/user/store",
            icon: "solar:bag-2-bold-duotone",
          },
          {
            title: "Wishlist",
            href: "/user/store/wishlist",
            icon: "solar:bag-heart-bold-duotone",
          },
        ],
      },
      {
        title: "Blog",
        href: "/user/blog",
        icon: "fluent:content-view-28-regular",
        env: process.env.NEXT_PUBLIC_BLOG_STATUS,
        description: "Read and write articles.",
        subMenu: [
          {
            title: "Author",
            href: "/user/blog/author",
            icon: "mdi:account-circle-outline",
          },
          {
            title: "New Post",
            href: "/user/blog/post",
            icon: "mdi:post-outline",
          },
        ],
      },
      {
        title: "Support",
        href: "/user/support/ticket",
        icon: "mdi:head-question",
        auth: true,
        description: "Get help from our support team.",
      },
    ],
  },
  {
    title: "P2P",
    href: "/p2p",
    icon: "material-symbols-light:p2p-outline",
    extension: "p2p",
    description: "Trade cryptocurrency with other users.",
  },
  {
    title: "ICO",
    href: "/ico",
    icon: "solar:dollar-minimalistic-line-duotone",
    extension: "ico",
    description: "Invest in ICO projects.",
  },
  {
    title: "Store",
    href: "/store",
    icon: "solar:bag-smile-bold-duotone",
    extension: "ecommerce",
    description: "Buy products from our store.",
  },
  {
    title: "Blog",
    href: "/blog",
    icon: "fluent:content-view-28-regular",
    env: process.env.NEXT_PUBLIC_BLOG_STATUS,
    description: "Read and write articles.",
  },
];
