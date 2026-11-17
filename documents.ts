import { LEGAL_URLS, PAYWALL_ENABLED } from '../pro/config';

/** In-app privacy policy and terms, shown when no hosted URL is configured
 *  (EXPO_PUBLIC_PRIVACY_URL / EXPO_PUBLIC_TERMS_URL). Keep in step with what the app really does. */
export type LegalDoc = 'privacy' | 'terms';
export interface LegalText { title: string; updated: string; intro: string; sections: { heading: string; body: string; paid?: true }[] }

export const legalUrl = (doc: LegalDoc) => LEGAL_URLS[doc] || '';

const zh: Record<LegalDoc, LegalText> = {
  privacy: {
    title: '隐私政策',
    updated: '最后更新：2026 年 11 月',
    intro: '拾色年鉴只在你的手机上工作。下面说明它会读取什么、留下什么，以及不会做什么。',
    sections: [
      { heading: '照片', body: '在你允许后，拾色年鉴读取相册里照片的缩略图和拍摄信息（时间、尺寸、是否为截屏等），用来算出每天的颜色。照片和缩略图都不会上传，也不会被复制到别处。' },
      { heading: '留在手机上的数据', body: '每天的颜色、色板、寻色记录、你选的照片和设置，都保存在这台手机的 App 数据里。删除 App，或在设置里选择「清除所有数据」，它们就会被删除。' },
      { heading: '没有账号，没有服务器', body: '拾色年鉴不需要注册，没有自己的服务器，不做广告，也不收集使用统计。' },
      { heading: '购买', body: '购买 Pro 由 App Store 完成。为确认购买状态，App 会通过 RevenueCat 读取一个匿名的购买标识；它不包含你的照片、颜色或姓名。付款信息只由 Apple 处理。', paid: true },
      { heading: '分享', body: '只有在你点「分享」或「保存到相册」时，才会生成图片，并交给你选择的 App 或系统相册。之后的处理遵循对方的隐私政策。' },
      { heading: '联系', body: '对隐私有任何疑问，可以通过 App Store 页面上的开发者联系方式找到我们。' },
    ],
  },
  terms: {
    title: '使用条款',
    updated: '最后更新：2026 年 11 月',
    intro: '使用拾色年鉴，即表示你同意以下条款。',
    sections: [
      { heading: '使用', body: '拾色年鉴供个人使用。你的照片始终属于你；App 只在手机上读取它们来生成颜色。' },
      { heading: 'Pro', body: 'Pro 可以一次买断，也可以按月或按年订阅。订阅会自动续期，可随时在 iPhone 的「设置 › Apple ID › 订阅」里取消，取消后在当期结束前仍可使用。退款由 Apple 按其政策处理。', paid: true },
      { heading: '分享的内容', body: '你分享的图片由你决定发到哪里，也由你对其内容负责。' },
      { heading: '免责', body: '颜色由算法从照片中得出，难免与你的感受不同。App 按现状提供，在法律允许的范围内，我们不对因使用 App 造成的间接损失负责。' },
      { heading: '变更', body: '条款如有变更，会在 App 内更新。继续使用即表示接受新的条款。' },
    ],
  },
};
const en: Record<LegalDoc, LegalText> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: November 2026',
    intro: 'Huedays works only on your phone. Here is what it reads, what it keeps, and what it never does.',
    sections: [
      { heading: 'Photos', body: 'With your permission, Huedays reads thumbnails of your photos and their capture details (time, size, whether it is a screenshot) to work out the color of each day. Photos and thumbnails are never uploaded or copied anywhere.' },
      { heading: 'What stays on your phone', body: 'Day colors, palettes, hunts, the photos you picked and your settings are stored in the app’s data on this phone. Deleting the app, or choosing “Erase all data” in Settings, removes them.' },
      { heading: 'No account, no server', body: 'Huedays has no sign-up and no server of its own. It shows no ads and collects no usage analytics.' },
      { heading: 'Purchases', body: 'Pro is bought through the App Store. To confirm a purchase, the app reads an anonymous purchase ID through RevenueCat; it contains none of your photos, colors or name. Payment details are handled only by Apple.', paid: true },
      { heading: 'Sharing', body: 'An image is made only when you tap Share or Save to Photos, and goes only to the app or photo library you choose. From there, that app’s privacy policy applies.' },
      { heading: 'Contact', body: 'For any privacy question, reach us through the developer contact on the App Store page.' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Last updated: November 2026',
    intro: 'By using Huedays you agree to these terms.',
    sections: [
      { heading: 'Use', body: 'Huedays is for personal use. Your photos remain yours; the app only reads them on your phone to find their colors.' },
      { heading: 'Pro', body: 'Pro is a one-time purchase or a monthly or yearly subscription. Subscriptions renew automatically and can be cancelled anytime in Settings › Apple ID › Subscriptions; Pro stays on until the end of the paid period. Refunds are handled by Apple under its policies.', paid: true },
      { heading: 'What you share', body: 'You decide where shared images go and are responsible for what they contain.' },
      { heading: 'No warranty', body: 'Colors are worked out from photos by an algorithm and may not match how you see them. The app is provided as is; to the extent the law allows, we are not liable for indirect losses from using it.' },
      { heading: 'Changes', body: 'If these terms change, the app will show the new version. Continuing to use it means you accept them.' },
    ],
  },
};
/** `paid` sections (purchases, subscriptions) only while the paywall is on. */
export const legalText = (lang: 'zh' | 'en', doc: LegalDoc, paywall = PAYWALL_ENABLED): LegalText => {
  const text = (lang === 'zh' ? zh : en)[doc];
  return paywall ? text : { ...text, sections: text.sections.filter(x => !x.paid) };
};
