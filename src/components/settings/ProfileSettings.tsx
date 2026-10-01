import { useState } from "react";

function ProfileSettings() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const sections = [
    {
      title: "Profile",
      description: "Your personal information",
    },
    {
      title: "Preferences",
      description: "Customize your AI stylist",
    },
    {
      title: "Notifications",
      description: "Manage your alerts",
    },
    {
      title: "Appearance",
      description: "Customize the interface",
    },
    {
      title: "Security",
      description: "Password and account security",
    },
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <div>
          <p className="dashboard-eyebrow">ACCOUNT SETTINGS</p>
          <h1>Profile & Settings</h1>
          <p>
            Manage your profile, preferences, notifications,
            and AI Closet experience.
          </p>
        </div>

        <div className="profile-avatar-large">P</div>
      </header>

      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          {sections.map((section) => (
            <button
              key={section.title}
              className={
                activeSection === section.title ? "active" : ""
              }
              onClick={() => setActiveSection(section.title)}
            >
              <div>
                <strong>{section.title}</strong>
                <span>{section.description}</span>
              </div>

              <span className="settings-arrow">→</span>
            </button>
          ))}

          <div className="account-card">
            <span>AI CLOSET ACCOUNT</span>
            <strong>Pawan Krishna</strong>
            <p>Free Plan</p>
            <button>Upgrade plan →</button>
          </div>
        </aside>

        {/* Content */}
        <main className="settings-content">
          {activeSection === "Profile" && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <div>
                  <p className="dashboard-eyebrow">PROFILE</p>
                  <h2>Personal information</h2>
                  <p>
                    Keep your personal information up to date.
                  </p>
                </div>
              </div>

              <div className="profile-photo-section">
                <div className="profile-avatar-large">P</div>

                <div>
                  <strong>Profile photo</strong>
                  <p>
                    This photo will appear across your AI Closet
                    account.
                  </p>

                  <button className="secondary-settings-button">
                    Change photo
                  </button>
                </div>
              </div>

              <div className="settings-form">
                <div className="settings-form-row">
                  <div className="settings-field">
                    <label htmlFor="first-name">First name</label>
                    <input
                      id="first-name"
                      type="text"
                      defaultValue="Pawan"
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="last-name">Last name</label>
                    <input
                      id="last-name"
                      type="text"
                      defaultValue="Krishna"
                    />
                  </div>
                </div>

                <div className="settings-field">
                  <label htmlFor="settings-email">Email address</label>
                  <input
                    id="settings-email"
                    type="email"
                    defaultValue="pawan@example.com"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    defaultValue="Chennai, Tamil Nadu"
                  />
                  <span className="field-hint">
                    Used later for weather-based outfit recommendations.
                  </span>
                </div>

                <div className="settings-actions">
                  <button
                    className="save-settings-button"
                    onClick={() => setSaved(true)}
                  >
                    {saved ? "Changes saved ✓" : "Save changes"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === "Preferences" && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <p className="dashboard-eyebrow">AI STYLIST</p>
                <h2>Styling preferences</h2>
                <p>
                  Tell AI Closet how you like to dress.
                </p>
              </div>

              <div className="preference-group">
                <label>Preferred style</label>

                <div className="preference-options">
                  {[
                    "Casual",
                    "Smart Casual",
                    "Formal",
                    "Sporty",
                    "Streetwear",
                  ].map((item) => (
                    <button
                      key={item}
                      className={item === "Smart Casual" ? "selected" : ""}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="preference-group">
                <label>Typical occasions</label>

                <div className="preference-options">
                  <button className="selected">College</button>
                  <button className="selected">Everyday</button>
                  <button>Work</button>
                  <button>Party</button>
                  <button>Travel</button>
                </div>
              </div>

              <div className="preference-group">
                <label>Outfit recommendations</label>

                <div className="preference-toggle-card">
                  <div>
                    <strong>Use clothes I haven't worn recently</strong>
                    <p>
                      AI will prioritize items that have been
                      sitting in your closet.
                    </p>
                  </div>

                  <div className="toggle active">
                    <div />
                  </div>
                </div>

                <div className="preference-toggle-card">
                  <div>
                    <strong>Prioritize weather</strong>
                    <p>
                      Avoid recommendations that are unsuitable
                      for current conditions.
                    </p>
                  </div>

                  <div className="toggle active">
                    <div />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "Notifications" && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <p className="dashboard-eyebrow">NOTIFICATIONS</p>
                <h2>Notification preferences</h2>
                <p>
                  Choose what AI Closet should notify you about.
                </p>
              </div>

              <div className="notification-list">
                <div className="preference-toggle-card">
                  <div>
                    <strong>Daily outfit recommendation</strong>
                    <p>
                      Receive your suggested outfit each morning.
                    </p>
                  </div>
                  <div className="toggle active"><div /></div>
                </div>

                <div className="preference-toggle-card">
                  <div>
                    <strong>Weather changes</strong>
                    <p>
                      Get notified when weather may affect your outfit.
                    </p>
                  </div>
                  <div className="toggle active"><div /></div>
                </div>

                <div className="preference-toggle-card">
                  <div>
                    <strong>Closet reminders</strong>
                    <p>
                      Reminders when you haven't added clothing recently.
                    </p>
                  </div>
                  <div className="toggle"><div /></div>
                </div>

                <div className="preference-toggle-card">
                  <div>
                    <strong>Product updates</strong>
                    <p>
                      Learn about new AI Closet features.
                    </p>
                  </div>
                  <div className="toggle"><div /></div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "Appearance" && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <p className="dashboard-eyebrow">APPEARANCE</p>
                <h2>Interface appearance</h2>
                <p>
                  Customize how AI Closet looks.
                </p>
              </div>

              <div className="appearance-options">
                <button className="appearance-card selected">
                  <div className="appearance-preview dark-preview">
                    <div />
                    <div />
                    <div />
                  </div>
                  <strong>Dark</strong>
                  <span>Current theme</span>
                </button>

                <button className="appearance-card">
                  <div className="appearance-preview light-preview">
                    <div />
                    <div />
                    <div />
                  </div>
                  <strong>Light</strong>
                  <span>Coming soon</span>
                </button>

                <button className="appearance-card">
                  <div className="appearance-preview system-preview">
                    <div />
                    <div />
                    <div />
                  </div>
                  <strong>System</strong>
                  <span>Coming soon</span>
                </button>
              </div>

              <div className="reduced-motion-card">
                <div>
                  <strong>Reduce animations</strong>
                  <p>
                    Minimize interface animations for accessibility.
                  </p>
                </div>

                <div className="toggle">
                  <div />
                </div>
              </div>
            </section>
          )}

          {activeSection === "Security" && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <p className="dashboard-eyebrow">SECURITY</p>
                <h2>Account security</h2>
                <p>
                  Manage your password and account protection.
                </p>
              </div>

              <div className="security-status">
                <div className="security-icon">✓</div>
                <div>
                  <strong>Your account is protected</strong>
                  <p>
                    Your password is currently protecting your account.
                  </p>
                </div>
              </div>

              <div className="security-option">
                <div>
                  <strong>Password</strong>
                  <p>Last changed recently</p>
                </div>

                <button className="secondary-settings-button">
                  Change password
                </button>
              </div>

              <div className="security-option">
                <div>
                  <strong>Two-factor authentication</strong>
                  <p>
                    Add an extra layer of protection to your account.
                  </p>
                </div>

                <button className="secondary-settings-button">
                  Enable 2FA
                </button>
              </div>

              <div className="danger-zone">
                <span>DANGER ZONE</span>
                <h3>Delete your account</h3>
                <p>
                  Permanently delete your AI Closet account and
                  associated data.
                </p>
                <button>Delete account</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProfileSettings;