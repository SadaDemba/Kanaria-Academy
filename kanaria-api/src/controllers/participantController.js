const prisma = require("../config/prisma");

class ParticipantController {

    static async registerParticipant(req, res) {
        const { firstName, lastName, email, phoneNumber, training, level, birthDate, role, motivation } = req.body;
        try {
            const participant = await prisma.participantForm.create({
                firstName,
                lastName,
                email,
                phoneNumber,
                training,
                level,
                birthDate,
                role,
                motivation,
                status: 'unread'
            });

            res.status(201).json({ message: 'Participant registered successfully!', participant });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred while registering participant', details: error.message });
        }
    };

    static async updateStatus(req, res) {
        const { status } = req.body;
        const validStatus = ['read', 'unread'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value. Allowed values are: read, unread.' });
        }
        try {

            const participant = await prisma.participantForm.findUnique({ where: { id: req.params.id } });

            if (!participant) {
                return res.status(404).json({ error: 'Participant not found' });
            }

            if (participant.status === status) {
                return res.status(400).json({ error: 'Already in this state' });
            }

            const form = await prisma.participantForm.update({
                where: { id: req.params.id },
                data: { status },
            })

            res.status(200).json(form);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async getParticipantById(req, res) {
        try {
            const participant = await prisma.participantForm.findUnique({ where: { id: req.params.id } });
            if (!participant) {
                return res.status(404).json({ error: 'Participant not found' });
            }
            res.status(200).json(participant);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };



    static async getAllParticipants(req, res) {
        try {
            const participants = await prisma.participantForm.findMany();
            res.status(200).json(participants);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async deleteParticipant(req, res) {
        try {
            const participant = await prisma.participantForm.findUnique({ where: { id: req.params.id } });
            if (!participant) {
                return res.status(404).json({ error: 'Participant not found' });
            }
            await prisma.participantForm.delete({
                where: {
                    id: participant.id,
                },
            })
            res.status(200).json({ message: 'Participant deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async getParticipantByEmail(req, res) {
        const { email } = req.query;
        try {
            const participant = await prisma.participantForm.findUnique({ where: { email: email } });

            if (!participant) {
                return res.status(404).json({ error: 'No participant found with the given email.' });
            }

            res.status(200).json(participant);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = ParticipantController;








