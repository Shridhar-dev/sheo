import React from 'react'

function InfoPage() {
  return (
    <div className='text-white p-8'>
      <p className='text-3xl font-bold'>Terms and Conditions</p>
      <p className='text-2xl mt-5'>Introduction</p>
      <p className='text-lg'>Welcome to our video-sharing platform. This platform is part of a project and is not intended for production use. By using this platform, you agree to the following terms and conditions.</p>
      <div>
        <p className='text-xl mt-5'>1. Acceptance of Terms</p>
        <p className='text-lg'>By accessing and using this platform, you accept and agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use the platform.</p>
        <p className='text-xl mt-2'>2. User Responsibilities</p>
        <p className='text-lg'>**Content**: Users are responsible for any content they upload. Content must not be illegal, offensive, or infringe on the rights of others.</p>
        <p className='text-lg'>**Conduct**: Users must conduct themselves respectfully and must not engage in any behavior that could harm the platform or other users.</p>
        <p className='text-xl mt-2'>3. Content Ownership</p>
        <p className='text-lg'>**User Content**: Users retain ownership of their content. However, by uploading content to the platform, users grant us a non-exclusive, royalty-free license to use, distribute, and display the content as part of the project.</p>
        <p className='text-lg'>**Platform Content**: All other content on the platform, including text, graphics, and code, is owned by the platform creators.</p>
        <p className='text-xl mt-2'>4. Privacy</p>
        <p className='text-lg'>We respect user privacy. Personal information collected during account registration and use of the platform will only be used for the purposes of this project and will not be shared with third parties.</p>
        <p className='text-xl mt-2'>5. Limitation of Liability</p>
        <p className='text-lg'>This platform is provided {`"as is"`} without warranties of any kind. As this is a project and not a production app, we are not liable for any issues that arise from using the platform, including but not limited to data loss or unauthorized access.</p>
        <p className='text-xl mt-2'>6. Modifications</p>
        <p className='text-lg'>We reserve the right to modify these terms and conditions at any time. Users will be notified of any changes, and continued use of the platform constitutes acceptance of the modified terms.</p>
        <p className='text-xl mt-2'>7. Termination</p>
        <p className='text-lg'>We reserve the right to terminate or suspend access to the platform at our discretion, without notice, for conduct that we believe violates these terms or is harmful to other users or the platform.</p>
        <p className='text-xl mt-2'>Contact Us</p>
        <p className='text-lg'>If you have any questions or concerns about these terms and conditions, please contact us at <a href="https://twitter.com/shridkdev" className='text-gray-200'>@shridkdev</a></p>
      </div>
      <p className='mt-5'>These terms and conditions are designed to outline the basic rules and responsibilities for users of our video-sharing platform project. Please remember that this is not a production application and should be used accordingly.</p>
    </div>
  )
}

export default InfoPage