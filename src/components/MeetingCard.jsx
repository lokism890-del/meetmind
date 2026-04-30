import { useNavigate } from 'react-router-dom';

const STATUS_BADGE = {
  done:      { label: 'Summarized', cls: 'badge-teal' },
  live:      { label: '● Live',     cls: 'badge-red' },
  upcoming:  { label: 'Upcoming',   cls: 'badge-amber' },
  processing:{ label: 'Processing', cls: 'badge-purple' },
};

const PLATFORM_ICON = {
  zoom:  '📹',
  meet:  '🟢',
  teams: '🟣',
};

export default function MeetingCard({ meeting }) {
  const navigate = useNavigate();
  const badge = STATUS_BADGE[meeting.status] || STATUS_BADGE.upcoming;
  const icon = PLATFORM_ICON[meeting.platform] || '📹';

  return (
    <div
      className="card"
      onClick={() => meeting.status === 'done' && navigate(`/meeting/${meeting.id}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: meeting.status === 'done' ? 'pointer' : 'default',
        padding: '14px 16px'
      }}
    >
      {/* Platform icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'var(--bg3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0
      }}>
        {icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Syne', fontWeight: 600, fontSize: 14,
          color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 3
        }}>
          {meeting.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {meeting.date} · {meeting.duration} · {meeting.attendees} attendees
        </div>
      </div>

      {/* Badge */}
      <span className={`badge ${badge.cls}`} style={{ flexShrink: 0 }}>
        {badge.label}
      </span>
    </div>
  );
}
