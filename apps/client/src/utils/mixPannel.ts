import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';

export function initMixPanel() {
  mixpanel.init(MIXPANEL_TOKEN, { debug: true });
}

initMixPanel();
export async function tracking(event: string, param?: object) {
  if (param) {
    mixpanel.track(event, param);
  } else {
    mixpanel.track(event);
  }
}
