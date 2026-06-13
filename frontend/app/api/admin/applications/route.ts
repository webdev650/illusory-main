import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import JobApplication from '../../../lib/models/JobApplication';
import Job from '../../../lib/models/Job';

// Secure endpoint by verifying authorization header against configured ADMIN_PASSWORD
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // Parse query filters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const jobTitle = searchParams.get('jobTitle');

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (jobTitle && jobTitle !== 'all') {
      query.jobTitle = jobTitle;
    }

    const applications = await JobApplication.find(query).sort({ appliedAt: -1 }).lean();
    const activeJobs = await Job.find({}).sort({ referenceId: 1 }).lean();

    return NextResponse.json({ 
      applications: applications.map((app: any) => ({
        ...app,
        _id: String(app._id)
      })), 
      jobs: activeJobs.map((job: any) => ({
        ...job,
        _id: String(job._id)
      }))
    });
  } catch (error: any) {
    console.error('Admin GET applications error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
    }

    const allowedStatuses = ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      application: {
        ...updatedApplication.toObject(),
        _id: String(updatedApplication._id)
      } 
    });
  } catch (error: any) {
    console.error('Admin PATCH application error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update application' }, { status: 500 });
  }
}
