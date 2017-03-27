
import React from 'react'

import Midpoint from './midpoint'

const Debug = (props) => {
	return <div>
		<pre>
			{JSON.stringify(props)}
		</pre>
		<input type="button" value="refresh" onClick={function(){
			props.refresh.call()
		}} />
	</div>
}

const Timestamp = ({time}) => {
	var d = new Date(time)
	return <span>{
		d.getFullYear() + "-" +
		(d.getMonth()+1) + "-" +
		d.getDay() + " " +
		d.getHours() + ":" +
		d.getMinutes() + ":" +
		d.getSeconds()
	}</span>
}

const JobRow = ({ job }) => (
	<tr>
		<td>
			{ job.ID }
		</td>
		<td>
			{ job.Title }
		</td>
		<td>
			<Timestamp time={job.Created}/>
		</td>
		<td>
			<Timestamp time={job.Modified}/>
		</td>
	</tr>
)

const JobListInner = (props) => {
	var { jobs_by_created, jobs_by_modified } = props

	return <div>
		<h3>jobs by created</h3>
		<table cellPadding="5">
			<tbody>
				{ jobs_by_created ? jobs_by_created.map( (v) => (<JobRow key={v.ID} job={v} />) ) : '' }
			</tbody>
		</table>
		<h3>jobs by modified</h3>
		<table cellPadding="5">
			<tbody>
				{ jobs_by_modified ? jobs_by_modified.map( (v) => (<JobRow key={v.ID} job={v} />) ) : '' }
			</tbody>
		</table>
	</div>
}

const JobList = (props) => {
	return <Midpoint
		jobs_by_created="/v1/joblist/created"
		jobs_by_modified="/v1/joblist/modified">

		<JobListInner />
	</Midpoint>
}

export default JobList
