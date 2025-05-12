import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type SubscriptionTier = 'free' | 'pro' | 'engineer';

/**
 * Middleware to check user's subscription tier and enforce usage limits
 * @param req The Next.js request object
 * @returns NextResponse or undefined to continue
 */
export async function checkSubscription(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's subscription tier
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('subscription_tier, usage_count')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const tier = userData.subscription_tier as SubscriptionTier;

    // Check usage limits based on subscription tier
    if (tier === 'free') {
      // Free tier: Check daily limit (3 per day)
      const today = new Date().toISOString().split('T')[0];
      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('role', 'user')
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`)
        .filter('conversation_id', 'in', `(select id from conversations where user_id = '${userId}')`);

      if (countError) {
        console.error('Error counting messages:', countError);
        return NextResponse.json({ error: 'Failed to check usage limit' }, { status: 500 });
      }

      if (count && count >= 3) {
        return NextResponse.json(
          {
            error: 'Daily limit exceeded',
            message: 'You\'ve reached your daily limit of 3 messages. Upgrade to a paid plan for more usage.',
            code: 'DAILY_LIMIT_EXCEEDED',
          },
          { status: 403 }
        );
      }
    } else if (tier === 'pro') {
      // Pro tier: Check monthly limit (100 per month)
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('role', 'user')
        .gte('created_at', firstDayOfMonth.toISOString())
        .filter('conversation_id', 'in', `(select id from conversations where user_id = '${userId}')`);

      if (countError) {
        console.error('Error counting messages:', countError);
        return NextResponse.json({ error: 'Failed to check usage limit' }, { status: 500 });
      }

      if (count && count >= 100) {
        return NextResponse.json(
          {
            error: 'Monthly limit exceeded',
            message: 'You\'ve reached your monthly limit of 100 messages. Upgrade to Pro Engineer for unlimited usage.',
            code: 'MONTHLY_LIMIT_EXCEEDED',
          },
          { status: 403 }
        );
      }
    }
    // Engineer tier has no limits

    // Add tier to request context for downstream handlers
    req.headers.set('X-Subscription-Tier', tier);
    
    // Continue to the next middleware or API route
    return undefined;
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ error: 'An error occurred while checking subscription' }, { status: 500 });
  }
}