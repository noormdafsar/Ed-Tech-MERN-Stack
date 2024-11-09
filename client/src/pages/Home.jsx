import React from 'react'
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      {/* section 1 */}
        <div className='relative mx-auto flex flex-col w-11/12 items-center 
        text-white justify-between'>
            <Link to={'/signup'}>
                <div className='mt-16 p-1 mx-auto rounded-full bg-richblue-800 font-bold 
                text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                    <div className='flex items-center p-4 gap-2 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <BiRightArrowAlt />
                    </div>
                </div>
            </Link>
        </div>


      {/* section 2 */}



      {/* section 3 */}



      {/* Footer */}
    </div>
  )
}

export default Home
