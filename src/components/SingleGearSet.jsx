import PropTypes from "prop-types";
import styles from './SingleGearSet.module.css';
import {useEffect, useState} from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { TbCancel } from "react-icons/tb";
import { MdAddCircleOutline } from "react-icons/md";



export default function SingleGearSet ({name, gearSet, updateSet, deleteSet, isTemplate}) {

    const [isEditing, setIsEditing] = useState(false);
    // editable states
    const [editedName, setEditedName] = useState(name);
    const [editedFront, setEditedFront] = useState(gearSet.front.join(','))
    const [editedBack, setEditedBack] = useState(gearSet.back.join(','))

    // keep props up to date
    useEffect(() => {
        setEditedName(name);
        setEditedFront(gearSet.front.join(','));
        const sortedBack = [...gearSet.back].sort((a,b) => a-b);
        setEditedBack(sortedBack.join(','));
    }, [name, gearSet])

    // saving
    const handleSave = () => {
        const newGearData = {
            front: editedFront.split(/[,:;-]+/).map(sprocket => Number(sprocket.trim())).filter(sprocket => !isNaN(sprocket) && sprocket > 0),
            back: editedBack.split(/[,:;-]+/).map(sprocket => Number(sprocket.trim())).filter(sprocket => !isNaN(sprocket) && sprocket > 0)
        }
        // save it
        updateSet(name, editedName, newGearData);
        // stop editing
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditedName(name);
        setEditedFront(gearSet.front.join(','));
        setEditedBack(gearSet.back.sort((a, b) => a-b).join(','));
        setIsEditing(false);
    }

    const handleDelete = () => {
        deleteSet(name);
    }

    return (
        <div className={styles.container}>
            {/* Front gears goes here */}

            <input
                className={`${styles.allInputs} 
                            ${styles.textDisplayed}
                            ${styles.frontGears}`}
                type={'text'}
                value={(isEditing || isTemplate) ? editedFront : gearSet.front.join('-')}
                onChange={(e) => setEditedFront(e.target.value)}
                disabled={!(isEditing || isTemplate)}
                placeholder={'front sprockets'}
            />
            {/* rear gears goes here */}

            <input
                className={`${styles.allInputs} 
                            ${styles.textDisplayed}
                            ${styles.rearGears}`}
                type={'text'}
                value={(isEditing || isTemplate) ? editedBack : gearSet.back.join('-')}
                onChange={(e) => setEditedBack(e.target.value)}
                disabled={!(isEditing || isTemplate)}
                placeholder={'back sprockets'}
            />

                {/* gearset Name */}

                <input
                    className={`${styles.allInputs} 
                                ${styles.textDisplayed}
                                ${styles.nameField}`}
                    type={'text'}
                    value={(isEditing || isTemplate) ? editedName : name}
                    onChange={(e) => setEditedName(e.target.value)}
                    disabled={!(isEditing || isTemplate)}
                    placeholder={'name'}
                />

                {/* All the buttons */}
                <div className={styles.btnGroup}>
                    {isTemplate ?
                        (<button
                            onClick={handleSave}
                            className={`${styles.btnSave} ${styles.anyButton}`}
                        > <MdAddCircleOutline />
                        </button> ): isEditing ?
                            <><button
                                onClick={handleSave}
                                className={`${styles.btnSave} ${styles.anyButton}`}
                            ><IoIosSave/></button>
                            <button
                                onClick={handleCancel}
                                className={`${styles.btnCancel} ${styles.anyButton}`}
                            ><TbCancel/></button> </> :
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`${styles.btnEdit} ${styles.anyButton}`}
                                ><FaEdit/></button>
                                <button
                                    onClick={handleDelete}
                                    className={`${styles.btnEdit} ${styles.anyButton}`}
                                ><MdDeleteForever/></button>
                            </>
                    }
                </div>
        </div>
    )
}

SingleGearSet.prototype = {
    name: PropTypes.string,
    gearSet: PropTypes.object,
    updateSet: PropTypes.func,
    deleteSet: PropTypes.func,
    isTemplate: PropTypes.bool
}

SingleGearSet.defaultProps = {
    isTemplate: false
}