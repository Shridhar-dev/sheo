
function SkeletonVideoCard() {
  return (
    <div className='animate-pulse'>
        <div className='h-[200px] bg-white bg-opacity-10'></div>
        <div className='mt-2 flex items-start gap-3'>
            <div className='rounded-full bg-white bg-opacity-10 flex justify-center items-center h-10 w-10'>
                <div className='rounded-full flex justify-center items-center h-10 w-10'/>
            </div>
            <div className='w-full'>
                <div className=' bg-white bg-opacity-10 w-full h-5 text-md font-medium'></div>
                <div className=' bg-white bg-opacity-10 w-full h-5 mt-2 text-sm text-opacity-50 font-medium'></div>
            </div>
        </div>
    </div>
  )
}

export default SkeletonVideoCard