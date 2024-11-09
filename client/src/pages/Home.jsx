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
                <div>
                    <div className='flex items-center p-4'>
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
