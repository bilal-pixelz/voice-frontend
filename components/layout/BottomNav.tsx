export enum BottomNavTab {
  Voice = 'Voice',
  Message = 'Message',
  History = 'History',
  Profile = 'Profile',
}

const tabs: BottomNavTab[] = [
  BottomNavTab.Voice,
  BottomNavTab.Message,
  BottomNavTab.History,
  BottomNavTab.Profile,
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button key={tab} className="bottom-nav__tab" type="button">
          <span className="bottom-nav__label">{tab}</span>
        </button>
      ))}
    </nav>
  )
}
