import { getSupabaseServiceClient } from "@/lib/supabase/client"

// This script is meant to be run manually to create a demo user
// You can run it with: npx tsx lib/seed-demo-user.ts

async function seedDemoUser() {
  try {
    const supabase = getSupabaseServiceClient()

    // Create demo user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "demo@codehomie.com",
      password: "demo123",
      email_confirm: true,
    })

    if (authError) throw authError

    console.log("Demo user created:", authData.user.id)

    // Create user record
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: "demo@codehomie.com",
      subscription_tier: "pro", // Give demo users pro access
    })

    if (userError) throw userError

    console.log("Demo user record created")

    // Create sample conversations
    const conversations = [
      {
        user_id: authData.user.id,
        title: "React Component Help",
      },
      {
        user_id: authData.user.id,
        title: "Debugging a Node.js API",
      },
      {
        user_id: authData.user.id,
        title: "Learning TypeScript",
      },
    ]

    const { data: convoData, error: convoError } = await supabase
      .from("conversations")
      .insert(conversations)
      .select("id")

    if (convoError) throw convoError

    console.log("Sample conversations created")

    // Add sample messages to first conversation
    if (convoData && convoData.length > 0) {
      const messages = [
        {
          conversation_id: convoData[0].id,
          role: "user",
          content: "Can you help me create a React component for a user profile card?",
        },
        {
          conversation_id: convoData[0].id,
          role: "assistant",
          content:
            'Here\'s a React component for a user profile card:\n\n```jsx\nimport React from \'react\';\n\nconst ProfileCard = ({ user }) => {\n  return (\n    <div className="profile-card">\n      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="profile-image" />\n      <h2>{user.name}</h2>\n      <p className="title">{user.title}</p>\n      <p>{user.bio}</p>\n      <div className="stats">\n        <div className="stat">\n          <span className="stat-value">{user.followers}</span>\n          <span className="stat-label">Followers</span>\n        </div>\n        <div className="stat">\n          <span className="stat-value">{user.following}</span>\n          <span className="stat-label">Following</span>\n        </div>\n      </div>\n      <button className="follow-button">Follow</button>\n    </div>\n  );\n};\n\nexport default ProfileCard;\n```\n\nYou can use this component like this:\n\n```jsx\nimport ProfileCard from \'./ProfileCard\';\n\nfunction App() {\n  const user = {\n    name: \'Jane Doe\',\n    title: \'Frontend Developer\',\n    bio: \'I love creating beautiful user interfaces with React\',\n    avatar: \'https://example.com/avatar.jpg\',\n    followers: 1234,\n    following: 567\n  };\n\n  return (\n    <div className="app">\n      <ProfileCard user={user} />\n    </div>\n  );\n}\n```\n\nDon\'t forget to add some CSS to style your profile card. Let me know if you need help with the styling as well!',
        },
      ]

      const { error: msgError } = await supabase.from("messages").insert(messages)

      if (msgError) throw msgError

      console.log("Sample messages created")
    }

    console.log("Demo user setup complete!")
  } catch (error) {
    console.error("Error seeding demo user:", error)
  }
}

seedDemoUser()
