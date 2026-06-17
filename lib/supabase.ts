import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (service role key)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

// Job statuses
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Job {
  id: string
  user_id: string
  mode: 'template' | 'prompt' | 'transform'
  status: JobStatus
  selfie_url?: string
  input_template?: string
  input_prompt?: string
  input_video_url?: string
  output_image_url?: string
  output_video_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}

// Create a job
export async function createJob(
  userId: string,
  mode: Job['mode'],
  data: {
    selfie_url?: string
    input_template?: string
    input_prompt?: string
    input_video_url?: string
  }
) {
  const { data: job, error } = await supabase.from('jobs').insert([
    {
      user_id: userId,
      mode,
      status: 'pending',
      ...data,
    },
  ]).select().single()

  if (error) throw error
  return job as Job
}

// Get job by ID
export async function getJob(jobId: string, userId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Job
}

// Get user's jobs
export async function getUserJobs(userId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Job[]
}

// Update job status
export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  updates?: Partial<Job>
) {
  const { data, error } = await supabase
    .from('jobs')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...updates,
    })
    .eq('id', jobId)
    .select()
    .single()

  if (error) throw error
  return data as Job
}

// Upload file to storage
export async function uploadFile(
  userId: string,
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${userId}/${path}`, file, {
      upsert: false,
    })

  if (error) throw error
  return data
}

// Get public URL for file
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}
