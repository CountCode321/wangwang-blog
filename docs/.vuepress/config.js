module.exports = {
    title: '汪汪的博客',
    description: 'Just do It !',
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    base: '/wangwang-blog/',
    theme: 'reco',
    "search": true,  //是否开启搜索
    "searchMaxSuggestions": 5,  //最多的搜索建议条目
    themeConfig: {
        // 博客配置
        type: 'blog',
        logo: '/img/head.jpg',
        authorAvatar: '/img/head.jpg',
        // 添加右链
        friendLink: [
            {
                title: 'Wangwang',
                desc: 'whj18095851856@163.com',
                logo: '/img/me.jpg'
            }
        ],
        // blog右侧
        blogConfig: {
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: 'Category' // 默认文案 “分类”
            },
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: 'Tag'      // 默认文案 “标签”
            },
            socialLinks: [     // 信息栏展示社交信息
                { icon: 'reco-github', link: 'https://github.com/CountCode321' },
                { icon: 'reco-npm', link: 'https://github.com/CountCode321' }
            ]
        },
        // 导航栏
        nav: [
            { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
        ]
    },
    "plugins": [
        [
            "@vuepress-reco/vuepress-plugin-kan-ban-niang",
            {
                theme: ["koharu"],
                clean: false,
                messages: {
                    welcome: '我是Lucky欢迎你的关注 ',
                    home: '心里的花，我想要带你回家~',
                    theme: '好吧，希望你能喜欢我的其他小伙伴。',
                    close: '我们还会再见的吧'
                }
            }
        ],
    ],
    "author": "wangwang", //版权信息，与昵称为同一数据
    "startYear": "2021" //开始年份
}